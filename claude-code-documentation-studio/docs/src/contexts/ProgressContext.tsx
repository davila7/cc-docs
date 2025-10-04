import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useLocation } from '@docusaurus/router';

interface PageVisit {
  id: string;
  user_id: string;
  section_id: string;
  page_id: string;
  page_title?: string;
  visited_at: string;
  time_spent_seconds: number;
  completed: boolean;
}

interface SectionProgress {
  section_id: string;
  total_pages: number;
  completed_pages: number;
  progress_percentage: number;
  started_at: string;
  last_visited_at: string;
}

interface CourseProgress {
  course_id: string;
  total_sections: number;
  completed_sections: number;
  overall_percentage: number;
  sections: SectionProgress[];
}

interface ProgressContextType {
  currentProgress: SectionProgress | null;
  allProgress: SectionProgress[];
  courseProgress: CourseProgress | null;
  trackPageVisit: (pageId: string, sectionId: string, courseId: string, pageTitle?: string) => Promise<void>;
  markPageCompleted: (pageId: string, sectionId: string) => Promise<void>;
  getSectionProgress: (sectionId: string) => SectionProgress | null;
  loading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Course and Section configuration
const COURSES = {
  'claude-code': {
    name: 'Claude Code Course',
    total_sections: 3,
    sections: {
      subagents: { total_pages: 2, name: 'Subagents' },
      hooks: { total_pages: 2, name: 'Hooks' },
      workflows: { total_pages: 1, name: 'Workflows' },
    }
  }
};

const SECTIONS = COURSES['claude-code'].sections;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  const [currentProgress, setCurrentProgress] = useState<SectionProgress | null>(null);
  const [allProgress, setAllProgress] = useState<SectionProgress[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageStartTime, setPageStartTime] = useState<number>(Date.now());

  // Extract section and page from URL
  const extractPageInfo = useCallback((pathname: string) => {
    const match = pathname.match(/\/docs\/([^\/]+)\/?(.*)?/);
    if (match) {
      const sectionId = match[1];
      const pageSlug = match[2] || 'overview';
      return { sectionId, pageId: pathname, pageSlug };
    }
    return null;
  }, []);

  // Load user progress
  const loadUserProgress = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAllProgress(data || []);

      // Calculate course progress
      const totalSections = COURSES['claude-code'].total_sections;

      if (data && data.length > 0) {
        const completedSections = data.filter(s => s.progress_percentage === 100).length;

        // Calculate overall percentage considering ALL sections (including non-visited ones as 0%)
        const totalProgress = data.reduce((acc, s) => acc + s.progress_percentage, 0);
        const avgPercentage = totalProgress / totalSections;

        setCourseProgress({
          course_id: 'claude-code',
          total_sections: totalSections,
          completed_sections: completedSections,
          overall_percentage: avgPercentage,
          sections: data,
        });
      } else {
        // No progress yet
        setCourseProgress({
          course_id: 'claude-code',
          total_sections: totalSections,
          completed_sections: 0,
          overall_percentage: 0,
          sections: [],
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Track page visit
  const trackPageVisit = useCallback(async (
    pageId: string,
    sectionId: string,
    courseId: string = 'claude-code',
    pageTitle?: string
  ) => {
    if (!user) return;

    try {
      // Record page visit
      const { error: visitError } = await supabase
        .from('page_visits')
        .insert({
          user_id: user.id,
          course_id: courseId,
          section_id: sectionId,
          page_id: pageId,
          page_title: pageTitle,
          visited_at: new Date().toISOString(),
        });

      if (visitError) throw visitError;

      // Update or create section progress
      const sectionConfig = SECTIONS[sectionId];
      if (!sectionConfig) return;

      // Get unique pages visited in this section
      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('page_id')
        .eq('user_id', user.id)
        .eq('section_id', sectionId);

      if (visitsError) throw visitsError;

      const uniquePages = new Set(visits?.map(v => v.page_id) || []);
      const completedPages = uniquePages.size;

      // Upsert progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          section_id: sectionId,
          total_pages: sectionConfig.total_pages,
          completed_pages: completedPages,
          last_visited_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id,section_id'
        });

      if (progressError) throw progressError;

      // Reload progress
      await loadUserProgress();
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  }, [user, loadUserProgress]);

  // Mark page as completed
  const markPageCompleted = useCallback(async (pageId: string, sectionId: string) => {
    if (!user) return;

    try {
      // Update the most recent visit for this page
      const { error } = await supabase
        .from('page_visits')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('page_id', pageId)
        .order('visited_at', { ascending: false })
        .limit(1);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking page completed:', error);
    }
  }, [user]);

  // Get section progress
  const getSectionProgress = useCallback((sectionId: string): SectionProgress | null => {
    return allProgress.find(p => p.section_id === sectionId) || null;
  }, [allProgress]);

  // Track page view on location change
  useEffect(() => {
    if (!user) return;

    const pageInfo = extractPageInfo(location.pathname);
    if (!pageInfo) return;

    const { sectionId, pageId } = pageInfo;

    // Track visit with course ID
    trackPageVisit(pageId, sectionId, 'claude-code');

    // Reset page start time
    setPageStartTime(Date.now());

    // Update time spent when leaving page
    return () => {
      const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
      if (timeSpent > 0) {
        supabase
          .from('page_visits')
          .update({ time_spent_seconds: timeSpent })
          .eq('user_id', user.id)
          .eq('page_id', pageId)
          .order('visited_at', { ascending: false })
          .limit(1)
          .then();
      }
    };
  }, [location.pathname, user, extractPageInfo, trackPageVisit, pageStartTime]);

  // Load progress on mount
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user, loadUserProgress]);

  // Update current progress based on location
  useEffect(() => {
    const pageInfo = extractPageInfo(location.pathname);
    if (pageInfo) {
      const progress = getSectionProgress(pageInfo.sectionId);
      setCurrentProgress(progress);
    }
  }, [location.pathname, allProgress, extractPageInfo, getSectionProgress]);

  const value = {
    currentProgress,
    allProgress,
    courseProgress,
    trackPageVisit,
    markPageCompleted,
    getSectionProgress,
    loading,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
