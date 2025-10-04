import React, { useState } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import ProgressBar from './ProgressBar';
import styles from './UserProgressDashboard.module.css';

const SECTION_COLORS = {
  subagents: '#f97316',
  hooks: '#3b82f6',
  workflows: '#10b981',
};

const SECTION_NAMES = {
  subagents: 'Subagents',
  hooks: 'Hooks',
  workflows: 'Workflows',
};

const SECTION_ICONS = {
  subagents: '🤖',
  hooks: '🪝',
  workflows: '⚡',
};

export default function UserProgressDashboard() {
  const { allProgress, courseProgress, loading } = useProgress();
  const [expandedCourse, setExpandedCourse] = useState<string>('');

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading progress...</div>
      </div>
    );
  }

  // Aquí puedes tener múltiples cursos en el futuro
  const courses = [
    {
      id: 'claude-code',
      name: 'Claude Code Course',
      icon: '📚',
      totalSections: courseProgress?.total_sections || 3,
      completedSections: courseProgress?.completed_sections || 0,
      overallProgress: courseProgress?.overall_percentage || 0,
    }
  ];

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? '' : courseId);
  };

  if (allProgress.length === 0) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.emptyState}>
          <h2>📚 Your Courses</h2>
          <p>🚀 Start learning to track your progress!</p>
          <p className={styles.emptyStateHint}>
            Visit any documentation page to begin your journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.dashboardTitle}>📚 My Courses</h2>

      <div className={styles.courseList}>
        {courses.map((course) => {
          const isExpanded = expandedCourse === course.id;

          return (
            <div key={course.id} className={styles.courseAccordion}>
              {/* Course Header - Clickeable */}
              <button
                className={`${styles.courseHeader} ${isExpanded ? styles.courseHeaderExpanded : ''}`}
                onClick={() => toggleCourse(course.id)}
              >
                <div className={styles.courseHeaderLeft}>
                  <span className={styles.courseIcon}>{course.icon}</span>
                  <div className={styles.courseInfo}>
                    <h3 className={styles.courseName}>{course.name}</h3>
                    <span className={styles.courseStats}>
                      {course.completedSections}/{course.totalSections} modules • {Math.round(course.overallProgress)}% complete
                    </span>
                  </div>
                </div>
                <div className={styles.courseHeaderRight}>
                  <div className={styles.courseProgressCompact}>
                    <ProgressBar
                      percentage={course.overallProgress}
                      size="small"
                      showLabel={false}
                      color="#f97316"
                    />
                  </div>
                  <svg
                    className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </button>

              {/* Course Content - Expandible */}
              {isExpanded && (
                <div className={styles.courseContent}>
                  <div className={styles.overallProgress}>
                    <h4>Overall Progress</h4>
                    <ProgressBar
                      percentage={course.overallProgress}
                      size="large"
                      color="#f97316"
                    />
                  </div>

                  <div className={styles.modules}>
                    <h4>Modules</h4>
                    {Object.entries(SECTION_NAMES).map(([sectionId, sectionName]) => {
                      const progress = allProgress.find(p => p.section_id === sectionId);
                      const percentage = progress?.progress_percentage || 0;
                      const completedPages = progress?.completed_pages || 0;
                      const totalPages = progress?.total_pages || 0;

                      return (
                        <div key={sectionId} className={styles.moduleCard}>
                          <div className={styles.moduleHeader}>
                            <div className={styles.moduleInfo}>
                              <span className={styles.moduleIcon}>
                                {SECTION_ICONS[sectionId]}
                              </span>
                              <div>
                                <h5 className={styles.moduleName}>{sectionName}</h5>
                                <span className={styles.modulePages}>
                                  {completedPages} / {totalPages} pages
                                </span>
                              </div>
                            </div>
                            {percentage === 100 && (
                              <span className={styles.completedBadge}>✓</span>
                            )}
                          </div>
                          <div className={styles.moduleProgress}>
                            <ProgressBar
                              percentage={percentage}
                              size="medium"
                              color={SECTION_COLORS[sectionId]}
                            />
                          </div>
                          {progress?.last_visited_at && (
                            <span className={styles.lastVisited}>
                              Last visited: {new Date(progress.last_visited_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
