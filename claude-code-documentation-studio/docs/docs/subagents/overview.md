---
sidebar_position: 1
---

# Overview

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Custom subagents in Claude Code are specialized AI assistants that can be invoked to handle specific types of tasks. They enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window.

<img width="665" height="503" alt="Screenshot 2025-09-27 at 17 09 29" src="https://github.com/user-attachments/assets/0b784f6c-113c-4a34-8bd3-be8c208ef233" />

## What are subagents?

Subagents are pre-configured AI personalities that Claude Code can delegate tasks to. Each subagent:

* Has a specific purpose and expertise area
* Uses its own context window separate from the main conversation
* Can be configured with specific tools it's allowed to use
* Includes a custom system prompt that guides its behavior

When Claude Code encounters a task that matches a subagent's expertise, it can delegate that task to the specialized subagent, which works independently and returns results.

## Quick start

To create your first subagent:

### 1. Open the subagents interface
Run the following command:
```
/agents
```

### 2. Select 'Create New Agent'
Choose whether to create a project-level or user-level subagent

### 3. Define the subagent
* **Recommended**: Generate with Claude first, then customize to make it yours
* Describe your subagent in detail and when it should be used
* Select the tools you want to grant access to (or leave blank to inherit all tools)
* The interface shows all available tools, making selection easy
* If you're generating with Claude, you can also edit the system prompt in your own editor by pressing `e`

### 4. Save and use
Your subagent is now available! Claude will use it automatically when appropriate, or you can invoke it explicitly:
```
> Use the code-reviewer subagent to check my recent changes
```

## Subagent configuration

### File locations

Subagents are stored as Markdown files with YAML frontmatter in two possible locations:

| Type                  | Location            | Scope                         | Priority |
| :-------------------- | :------------------ | :---------------------------- | :------- |
| **Project subagents** | `.claude/agents/`   | Available in current project  | Highest  |
| **User subagents**    | `~/.claude/agents/` | Available across all projects | Lower    |

When subagent names conflict, project-level subagents take precedence over user-level subagents.
