import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Custom sidebar for Claude Code Advanced Patterns documentation
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🤖 Subagents',
      items: [
        'subagents/overview',
        'subagents/docusaurus-expert'
      ],
    },
    {
      type: 'category',
      label: '🪝 Hooks',
      items: [
        'hooks/overview',
        'hooks/discord-notification-hook'
      ],
    },
    {
      type: 'category',
      label: '🔄 Workflows',
      items: [
        'workflows/cicd-workflow',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Setup & Testing',
      items: [
        'setup/discord-setup',
        'setup/testing',
      ],
    },
  ],
};

export default sidebars;
