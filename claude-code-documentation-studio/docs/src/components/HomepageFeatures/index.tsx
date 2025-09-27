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
    title: 'Claude Code Hooks',
    description: 'Event-Driven Automation',
    details: 'Learn to create powerful hooks that automate your development workflow. Send Discord notifications, format code, and integrate with external services when Claude Code events occur.',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #f97316 100%)',
    link: '/docs/hooks/overview',
    type: 'Course'
  },
  {
    title: 'Docusaurus Expert Agent',
    description: 'Intelligent Documentation Assistant',
    details: 'Master the specialized agent that automatically generates and maintains documentation. Transform code changes into comprehensive docs with real-world examples and best practices.',
    gradient: 'linear-gradient(135deg, #2d2d2d 0%, #fb923c 100%)',
    link: '/docs/subagents/docusaurus-expert',
    type: 'Course'
  },
  {
    title: 'Complete CI/CD Workflow',
    description: 'GitHub Actions Integration',
    details: 'Build end-to-end automation pipelines that combine agents and hooks with GitHub Actions. Create documentation PRs automatically and notify your team through Discord.',
    gradient: 'linear-gradient(135deg, #374151 0%, #fdba74 100%)',
    link: '/docs/workflows/cicd-workflow',
    type: 'Workflow'
  },
];

function Feature({title, description, details, gradient, link, type}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
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
            Master Documentation Automation
          </Heading>
          <p className={styles.sectionSubtitle}>
            Learn to build intelligent workflows that keep your documentation always up-to-date
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}