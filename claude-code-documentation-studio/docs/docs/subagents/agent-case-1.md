---
sidebar_position: 2
---

# Agent Case 1: Docusaurus Expert Agent

> Automated documentation agent specialized in Docusaurus site management and content generation for intelligent documentation workflows.

## What is a Claude Code Agent?

Claude Code agents are specialized AI assistants that focus on specific development tasks. They are configured with:

- **Specific knowledge domain** (e.g., Docusaurus, React, Python)
- **Defined tools access** (Read, Write, Edit, Bash, etc.)
- **Clear instructions** for their specialized role
- **Context awareness** of your project structure

Think of agents as **AI specialists on your team** - each one is an expert in their particular area who can work autonomously on complex tasks.

## Docusaurus Expert Agent Overview

The Docusaurus Expert Agent is a specialized AI assistant that:

- **Analyzes code changes** and determines documentation needs
- **Updates existing documentation** to reflect new features or changes
- **Creates new documentation files** for new functionality
- **Maintains consistent style** across all documentation
- **Integrates with CI/CD pipelines** for automated workflows

### Key Capabilities

| Capability | Description |
|------------|-------------|
| **Content Analysis** | Reads and understands existing documentation structure |
| **Change Detection** | Identifies what documentation needs updating based on code changes |
| **File Management** | Creates, updates, and organizes Markdown files |
| **Style Consistency** | Maintains consistent documentation formatting and tone |
| **Integration Ready** | Works seamlessly with GitHub Actions and webhooks |

## Installation and Setup

### Step 1: Install the Agent

First, install the Docusaurus Expert agent in your project:

```bash
# Navigate to your project root
cd your-project

# Install the Docusaurus Expert agent
npx claude-code-templates@latest --agent=documentation/docusaurus-expert --yes
```

This creates a file at `.claude/agents/docusaurus-expert.md` with the agent configuration.

### Step 2: Verify Agent Installation

Check that the agent was installed correctly:

```bash
# List available agents
claude /agents

# You should see "docusaurus-expert" in the list
```

### Step 3: Test the Agent Locally

Test the agent with a simple documentation task:

```bash
# Example: Ask the agent to analyze your docs
claude "Use the docusaurus-expert agent to analyze my current documentation structure and suggest improvements"
```

## Agent Configuration

The Docusaurus Expert agent is configured with specific instructions and tool access. Here's what the configuration looks like:

### Agent File Structure
```markdown
---
name: docusaurus-expert
description: Docusaurus documentation specialist
tools: Read, Write, Edit, Bash, Glob, Grep
model: claude-3-5-sonnet-20241022
---

You are a Docusaurus documentation expert specializing in:
- Site configuration and optimization
- Content creation and management
- Navigation and structure organization
- Integration with build systems
- Performance optimization
```

### Tools Access
The agent has access to these Claude Code tools:

- **Read**: Analyze existing documentation files
- **Write**: Create new documentation files
- **Edit**: Update existing content
- **Bash**: Execute build commands and file operations
- **Glob**: Find files matching patterns
- **Grep**: Search content within files

## Real-World Usage Example

Let's walk through a practical example of how the Docusaurus Expert agent works in a development workflow:

### Scenario: Adding a New API Endpoint

Imagine you've just added a new API endpoint `/api/users/profile` to your application. Here's how the agent helps:

#### 1. Agent Analysis
```bash
claude "Use docusaurus-expert agent to document the new /api/users/profile endpoint based on the changes in src/api/users.js"
```

#### 2. Agent Actions
The agent will:
- **Read** the new code in `src/api/users.js`
- **Analyze** the endpoint functionality
- **Find** the appropriate documentation location (e.g., `docs/api/users.md`)
- **Update** or **create** documentation with:
  - Endpoint description
  - Parameters and types
  - Response examples
  - Error handling
  - Usage examples

#### 3. Generated Documentation
```markdown
## GET /api/users/profile

Retrieves the current user's profile information.

### Parameters
- `Authorization` (header): Bearer token required

### Response
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "profile": {
    "firstName": "string",
    "lastName": "string"
  }
}
```

### Example Usage
```javascript
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
});
const profile = await response.json();
```
```

## GitHub Actions Integration

The Docusaurus Expert agent becomes powerful when integrated with GitHub Actions. Here's how it works in an automated workflow:

### Workflow Trigger
```yaml
on:
  pull_request:
    branches: [main]
    paths:
      - '**.js'
      - '**.ts'
      - '**.py'
      - '!docs/**'  # Prevent infinite loops
```

### Agent Execution
```yaml
- name: Update documentation
  uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: |
      Use the docusaurus-expert agent to:
      1. Analyze changed files: ${{ steps.changed.outputs.files }}
      2. Update relevant documentation
      3. Create new docs for new features
      4. Maintain consistency with existing style
```

### Automated PR Creation
The workflow automatically creates a new pull request with:
- Updated documentation files
- Descriptive commit messages
- List of changes made
- Ready for team review

## Benefits and Use Cases

### For Development Teams

| Benefit | Impact |
|---------|--------|
| **Always Current** | Documentation stays synchronized with code changes |
| **Consistent Style** | AI maintains uniform formatting and tone |
| **Reduced Manual Work** | Developers focus on code, agent handles docs |
| **Better Coverage** | Nothing gets forgotten or skipped |

### Common Use Cases

1. **API Documentation**: Automatically update API docs when endpoints change
2. **Feature Documentation**: Create docs for new features as they're developed
3. **Configuration Updates**: Update setup guides when config changes
4. **Code Examples**: Generate and maintain accurate code examples
5. **Migration Guides**: Create upgrade documentation for breaking changes

## Best Practices

### 1. Clear Commit Messages
When making code changes, use descriptive commit messages that help the agent understand the context:

```bash
# Good
git commit -m "feat: add user profile endpoint with avatar upload"

# Better context for the agent
git commit -m "feat(api): add GET /api/users/profile endpoint
- Returns user profile data including avatar URL
- Requires authentication
- Supports optional fields parameter"
```

### 2. Structured Code Comments
Add comments in your code that help the agent understand the intended documentation:

```javascript
/**
 * User Profile API Endpoint
 * @route GET /api/users/profile
 * @description Retrieves current user profile information
 * @requires Authentication
 * @returns {Object} User profile data
 */
export async function getUserProfile(req, res) {
  // Implementation...
}
```

### 3. Documentation Structure
Maintain a clear documentation structure that the agent can follow:

```
docs/
├── api/
│   ├── authentication.md
│   ├── users.md
│   └── posts.md
├── guides/
│   ├── getting-started.md
│   └── deployment.md
└── examples/
    ├── basic-usage.md
    └── advanced-patterns.md
```

## Troubleshooting

### Common Issues

**Agent not found**
```bash
# Verify agent installation
ls -la .claude/agents/
# Should show docusaurus-expert.md
```

**Documentation not updating**
```bash
# Check agent has proper tool access
claude "Use docusaurus-expert agent to list available tools"
```

**Inconsistent style**
```bash
# Provide style guidelines to the agent
claude "Use docusaurus-expert agent to review and standardize the documentation style in docs/ following the existing pattern in docs/api/users.md"
```

## Next Steps

Now that you understand how the Docusaurus Expert agent works, you're ready to:

1. **Install the agent** in your project
2. **Test it locally** with your documentation
3. **Set up GitHub Actions** for automated workflows
4. **Configure Discord notifications** for team updates

Continue with [Hook Case 1](/docs/hooks/hook-case-1) to learn how to add automated notifications when the agent creates documentation updates.

---

*Ready to automate your documentation? The Docusaurus Expert agent eliminates the tedious work of keeping docs synchronized with your code changes.*