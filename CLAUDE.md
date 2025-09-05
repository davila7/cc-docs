# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository contains Claude Code documentation organized into several main directories:

- `claude-code-docs/`: Official Claude Code documentation structured in 7 main sections:
  1. Getting Started - Overview, quickstart, and common workflows
  2. Build with Claude Code - Subagents, output styles, hooks, GitHub Actions, MCP, troubleshooting
  3. Claude Code SDK - Overview, headless mode, Python/TypeScript SDKs
  4. Deployment - Amazon Bedrock, Google Vertex AI, corporate proxy, LLM gateway, devcontainer
  5. Administration - Setup, IAM, security, data usage, monitoring, costs, analytics
  6. Configuration - Settings, IDE integration, terminal config, model config, memory, statusline
  7. Reference - CLI reference, interactive mode, slash commands, hooks

- `claude-code-from-zero-to-hero/`: Tutorial article for getting started with Claude Code
- `how-anthropic-teams-use-claude-code/`: Case studies on how Anthropic teams use Claude Code

## Content Type

This is a documentation repository containing Markdown files. There are no build processes, test suites, or development dependencies to manage. All content is static documentation written in Markdown format.

## Working with Documentation

### File Organization Patterns
- Files use standard Markdown syntax with frontmatter when applicable
- Documentation is organized hierarchically by numbered directories and files (e.g., `1-getting-started/`, `2-build-with-claude-code/`)
- File naming convention: `{number}-{descriptive-name}.md`
- The main documentation follows a structured approach with clear sections and subsections
- Images and media assets are referenced using standard Markdown image syntax

### Content Structure Guidelines
- Each documentation section follows a consistent structure:
  - Clear headings using `##` and `###`
  - Code examples in fenced code blocks with language specification
  - Step-by-step instructions when applicable
  - Cross-references to related documentation sections

### Special Content Types
- **Tutorial articles**: Located in `claude-code-from-zero-to-hero/`, written as comprehensive guides
- **Case studies**: Located in `how-anthropic-teams-use-claude-code/`, focus on real-world usage patterns
- **Reference documentation**: Contains CLI commands, configuration options, and technical specifications

### Documentation Maintenance
- When updating documentation, maintain consistency with existing formatting
- Ensure code examples are functional and up-to-date
- Update cross-references when moving or renaming files
- The repository serves as the authoritative source for Claude Code documentation