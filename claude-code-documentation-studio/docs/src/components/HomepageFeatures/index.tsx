import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  details: string;
  gradient: string;
  link: string;
  type: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Subagents',
    description: 'Foundation Concepts',
    details: 'Learn the fundamentals of Claude Code subagents. Understand how specialized agents work, their capabilities, and how to configure them for your projects.',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #f97316 100%)',
    link: '/docs/subagents/overview',
    type: 'Module 1'
  },
  {
    title: 'Docusaurus Expert Agent',
    description: 'Specialized Agent',
    details: 'Master the documentation specialist agent. Learn to automate docs generation, configure advanced settings, and integrate with your development workflow.',
    gradient: 'linear-gradient(135deg, #2d2d2d 0%, #fb923c 100%)',
    link: '/docs/subagents/docusaurus-expert',
    type: 'Module 2'
  },
  {
    title: 'Hooks',
    description: 'Event-Driven Automation',
    details: 'Discover how to create powerful hooks that respond to Claude Code events. Build custom automation workflows and integrate with external services.',
    gradient: 'linear-gradient(135deg, #374151 0%, #fdba74 100%)',
    link: '/docs/hooks/overview',
    type: 'Module 3'
  },
  {
    title: 'Discord Notification Hook',
    description: 'Team Communication',
    details: 'Build a practical Discord notification system. Learn to create hooks that send real-time updates to your team when agents complete tasks.',
    gradient: 'linear-gradient(135deg, #4b5563 0%, #fbbf24 100%)',
    link: '/docs/hooks/discord-notification-hook',
    type: 'Module 4'
  },
  {
    title: 'CI/CD Workflow',
    description: 'Complete Integration',
    details: 'Combine everything into a production-ready CI/CD pipeline. Automate documentation updates and team notifications with GitHub Actions.',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #f59e0b 100%)',
    link: '/docs/workflows/cicd-workflow',
    type: 'Module 5'
  },
];

function Feature({title, description, details, gradient, link, type}: FeatureItem) {
  return (
    <div className={styles.featureWrapper}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard} style={{background: gradient}}>
          <div className={styles.featureContent}>
            <div className={styles.featureType}>{type}</div>
            <Heading as="h3" className={styles.featureTitle}>
              {title}
            </Heading>
            <p className={styles.featureDescription}>{description}</p>
            <p className={styles.featureDetails}>{details}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            Start Your Claude Code Journey
          </Heading>
          <p className={styles.sectionSubtitle}>
            Take our progressive courses and master Claude Code step by step. More advanced courses coming soon!
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}