# Claude Code Advanced Patterns Documentation

This directory contains the Docusaurus documentation site for Advanced Claude Code Subagents and Hooks Integration Patterns.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd docs
npm install
```

### Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Serve built site
npm run serve

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

## Project Structure

```
docs/
├── docs/                    # Documentation content
│   ├── intro.md            # Main intro page
│   ├── getting-started/    # Getting started guides
│   ├── subagents/          # Subagent documentation
│   ├── hooks/              # Hooks documentation
│   ├── workflows/          # Workflow patterns
│   ├── performance/        # Performance optimization
│   ├── security/           # Security patterns
│   ├── troubleshooting/    # Troubleshooting guides
│   └── reference/          # API reference
├── blog/                   # Blog posts / examples
├── src/                    # Custom React components
├── static/                 # Static assets
├── docusaurus.config.ts    # Docusaurus configuration
├── sidebars.ts             # Sidebar configuration
└── package.json           # Dependencies and scripts
```

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch via GitHub Actions.

### Manual Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy:gh-pages
```

## Writing Documentation

### Adding New Pages

1. Create a new Markdown file in the appropriate `docs/` subdirectory
2. Add frontmatter with `sidebar_position` and other metadata
3. Update `sidebars.ts` if creating new sections
4. Link to the page from other relevant pages

### Markdown Features

Docusaurus supports:
- Standard Markdown syntax
- MDX (React components in Markdown)
- Code blocks with syntax highlighting
- Admonitions (tips, warnings, notes)
- Tabs and other interactive elements

### Example Page Structure

```markdown
---
sidebar_position: 1
---

# Page Title

Brief description of the page content.

## Section 1

Content here...

### Subsection

More detailed content...

```python
# Code example
def example_function():
    return "Hello, World!"
```

:::tip
This is a tip admonition.
:::
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `docs/` directory
4. Test locally with `npm start`
5. Submit a pull request

## Support

- [GitHub Issues](https://github.com/anthropic/claude-code-agents-hooks-advanced/issues)
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)