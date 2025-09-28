---
sidebar_position: 1
---

# Overview

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Custom subagents in Claude Code are specialized AI assistants that can be invoked to handle specific types of tasks. They enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    width="665"
    height="503"
    alt="Claude Code Subagents Interface - Specialized AI assistants for different tasks"
    src="https://github.com/user-attachments/assets/0b784f6c-113c-4a34-8bd3-be8c208ef233"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Claude Code subagents interface showing different specialized AI assistants
  </p>
</div>

## What are subagents?

Subagents are pre-configured AI personalities that Claude Code can delegate tasks to. Each subagent:

- **Has a specific purpose and expertise area** - Focused on one type of task
- **Uses its own context window** - Separate from the main conversation to avoid confusion
- **Can be configured with specific tools** - Only the tools it needs for its job
- **Includes a custom system prompt** - That guides its behavior and expertise

When Claude Code encounters a task that matches a subagent's expertise, it can delegate that task to the specialized subagent, which works independently and returns results.

## Quick start

To create your first subagent:

### 1. Open the subagents interface
Run the following command:
```bash
/agents
```

### 2. Select 'Create New Agent'
Choose whether to create a:
- **Project-level subagent** - Only available in current project
- **User-level subagent** - Available across all your projects

### 3. Define the subagent
**💡 Recommended approach**: Generate with Claude first, then customize to make it yours

- **Describe your subagent** in detail and when it should be used
- **Select the tools** you want to grant access to (or leave blank to inherit all tools)
- **Review the interface** - shows all available tools, making selection easy
- **Edit if needed** - You can edit the system prompt in your own editor by pressing `e`

### 4. Save and use
Your subagent is now available! Claude will use it automatically when appropriate, or you can invoke it explicitly:

```bash
> Use the code-reviewer subagent to check my recent changes
```

## Subagent configuration

### File locations

Subagents are stored as Markdown files with YAML frontmatter in two possible locations:

| Type | Location | Scope | Priority |
|:-----|:---------|:------|:---------|
| **Project subagents** | `.claude/agents/` | Available in current project | ⚡ Highest |
| **User subagents** | `~/.claude/agents/` | Available across all projects | 📊 Lower |

**📝 Note**: When subagent names conflict, project-level subagents take precedence over user-level subagents.

### File structure

Each subagent is defined in a Markdown file with the following structure:

```markdown
---
name: your-subagent-name
description: Brief description of what this subagent does
tools: [Read, Write, Edit, Bash] # Optional: specific tools, or omit for all tools
---

# System Prompt

Your detailed instructions for how this subagent should behave...
```

## Best practices

### When to create subagents

✅ **Good candidates for subagents:**
- **Repetitive specialized tasks** - Code reviews, documentation writing, testing
- **Domain-specific expertise** - Security analysis, performance optimization
- **Consistent workflows** - Following specific coding standards or patterns
- **Tool-specific operations** - Database queries, API testing, deployment scripts

❌ **Not ideal for subagents:**
- One-off tasks that don't repeat
- General conversation or brainstorming
- Tasks that require full context of your conversation

### Subagent design tips

1. **Be specific about the role** - "Python code reviewer" vs "code helper"
2. **Define clear boundaries** - What the subagent should and shouldn't do
3. **Include examples** - Show the subagent how you want it to respond
4. **Specify tools carefully** - Only give access to tools the subagent needs
5. **Test and iterate** - Refine the prompt based on actual usage

## Next steps

Now that you understand subagents, let's create a practical one:

**[Build a Docusaurus Expert Agent →](/docs/subagents/docusaurus-expert)**

Learn how to create a specialized subagent for documentation automation using Docusaurus.

---

*Ready to build your first subagent? The Docusaurus Expert tutorial will show you how to create a real-world automation assistant.*