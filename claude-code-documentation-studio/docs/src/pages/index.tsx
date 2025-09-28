import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Claude Code Academy
        </Heading>
        <p className="hero__subtitle">
          Learn Claude Code components, real-world use cases, and production workflows through hands-on tutorials and practical examples.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            Explore Claude Code
          </Link>
        </div>
      </div>
    </header>
  );
}

import {useState} from 'react';

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "Are subagents available in Claude Code SDK and GitHub Actions?",
      answer: "Subagents are available via the Claude Code SDK. They're not yet integrated into GitHub Actions, but we are considering this. The UX collapses outputs when more than three subagents run in parallel to manage complexity."
    },
    {
      question: "Can subagents be configured to use specific MCP tools?",
      answer: "Yes, when creating a subagent, you can specify which tools it has access to using the `tools` field in the configuration. You can either omit the tools field to inherit all tools from the main thread, or specify individual tools as a comma-separated list for more granular control."
    },
    {
      question: "How can we implement PR review automation with Claude Code?",
      answer: "While there isn't a turnkey PR reviewer solution yet, you can use the Claude Code GitHub Actions integration for automated reviews. You can use the security review action as a template and customize it for general PR reviews. This is also a good use case for the Claude Code SDK."
    },
    {
      question: "Can Claude Code integrate with CI/CD, version control, and observability platforms?",
      answer: "Yes, Claude Code integrates with GitHub Actions for CI/CD, supports git operations, and can connect to various platforms via MCP servers. It provides comprehensive integration capabilities for modern development workflows."
    },
    {
      question: "Does Claude Code index my entire codebase or use a vector database?",
      answer: "No. Claude Code has access to tools that navigate your codebase on command. When Claude Code needs to understand something about your codebase, it uses search tools and reads files on demand. This is more effective and flexible than full codebase indexing."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <Heading as="h2" className={styles.faqTitle}>
          Frequently Asked Questions
        </Heading>
        <p className={styles.faqSubtitle}>
          Updated this week. Common questions about Claude Code components, integrations, and workflows.
        </p>

        <div className={styles.accordionContainer}>
          {faqItems.map((item, index) => (
            <div key={index} className={styles.accordionItem}>
              <button
                className={`${styles.accordionButton} ${openIndex === index ? styles.accordionButtonOpen : ''}`}
                onClick={() => toggleAccordion(index)}
                type="button"
              >
                <span className={styles.accordionQuestion}>{item.question}</span>
                <span className={`${styles.accordionIcon} ${openIndex === index ? styles.accordionIconOpen : ''}`}>
                  ▲
                </span>
              </button>
              <div className={`${styles.accordionContent} ${openIndex === index ? styles.accordionContentOpen : ''}`}>
                <div className={styles.accordionAnswer}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.faqFooter}>
          <p>For more detailed information, visit the <Link to="https://docs.claude.com/en/docs/claude-code">Claude Code Documentation</Link></p>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Claude Code Academy"
      description="Learn Claude Code components, use cases, and production workflows through practical tutorials">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <FAQAccordion />
      </main>
    </Layout>
  );
}