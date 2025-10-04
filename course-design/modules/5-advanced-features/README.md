# Module 5: Advanced Features and Customization

**Duration:** 5-6 hours
**Prerequisites:** Module 1-4

## Module Overview

This module explores advanced Claude Code features and customization capabilities. You'll learn to create specialized subagents, configure custom output styles, implement automation hooks, and integrate external services through the Model Context Protocol (MCP) to build sophisticated, tailored development workflows.

## Learning Outcomes

**LO 5.1:** **Create** custom subagents **for specialized development tasks** to automate domain-specific workflows efficiently.

**LO 5.2:** **Configure** output styles **to customize Claude Code's response format** to match team preferences and requirements.

**LO 5.3:** **Implement** hooks **to automate workflows at specific trigger points** to enforce standards and streamline repetitive tasks.

**LO 5.4:** **Integrate** Model Context Protocol (MCP) servers **to extend Claude Code capabilities** to access external data sources and tools.

## Achievement Indicators

**For LO 5.1:**
- AI 5.1.1: Identifies tasks that benefit from specialized subagents
- AI 5.1.2: Creates subagent configurations with appropriate system prompts
- AI 5.1.3: Configures tool access for subagents based on their purpose
- AI 5.1.4: Tests subagent behavior and refines based on results
- AI 5.1.5: Manages project-level and user-level subagents effectively

**For LO 5.2:**
- AI 5.2.1: Creates custom output styles using the configuration interface
- AI 5.2.2: Defines appropriate prompts for different output scenarios
- AI 5.2.3: Uses output styles to enforce response format consistency
- AI 5.2.4: Switches between output styles based on task requirements
- AI 5.2.5: Shares output styles with team for standardization

**For LO 5.3:**
- AI 5.3.1: Identifies workflow points suitable for automation via hooks
- AI 5.3.2: Implements pre-commit hooks for code quality checks
- AI 5.3.3: Creates post-tool hooks for specific automation needs
- AI 5.3.4: Uses prompt submit hooks for request enhancement
- AI 5.3.5: Debugs and maintains hook configurations

**For LO 5.4:**
- AI 5.4.1: Configures MCP server connections in Claude Code settings
- AI 5.4.2: Accesses external data sources through MCP tools
- AI 5.4.3: Integrates custom tooling via MCP protocol
- AI 5.4.4: Troubleshoots MCP connection and authentication issues
- AI 5.4.5: Creates workflows leveraging MCP capabilities

## Module Contents

1. [Subagent Development](./1-subagents.md)
2. [Output Style Configuration](./2-output-styles.md)
3. [Hooks Implementation](./3-hooks.md)
4. [MCP Integration](./4-mcp-integration.md)
5. [Automation Suite Assembly](./5-automation-suite.md)

## Learning Activities

### Activity 5.1: Subagent Development Workshop (120 min)
Master subagent creation and management for specialized tasks.

### Activity 5.2: Output Style Configuration (60 min)
Create and use custom output formats for different scenarios.

### Activity 5.3: Hooks Implementation Lab (90 min)
Implement automated workflow hooks for quality and efficiency.

### Activity 5.4: MCP Integration Workshop (90 min)
Connect external services via Model Context Protocol.

### Activity 5.5: Automation Suite Assembly (60 min)
Combine all customizations into a cohesive automation system.

## Summative Assessment

**Project:** Custom Automation Suite Development

Build a complete customization package for a specific workflow:
1. Design and implement 3 specialized subagents for specific roles (e.g., code-reviewer, test-runner, documentation-generator)
2. Create 2 custom output styles for different scenarios (e.g., technical documentation, commit messages)
3. Implement 3 hooks (pre-commit, post-tool, prompt-submit) for workflow automation
4. Configure at least one MCP server integration (e.g., Google Drive, Slack, or custom)
5. Document the complete automation suite
6. Demonstrate the automation in action with real tasks

[Assessment Details](./assessment.md)

## Resources

- [Subagents Documentation](https://docs.anthropic.com/claude/docs/subagents)
- [Output Styles Guide](https://docs.anthropic.com/claude/docs/output-styles)
- [Hooks Reference](https://docs.anthropic.com/claude/docs/hooks)
- [MCP Documentation](https://docs.anthropic.com/claude/docs/mcp)
- [Configuration Templates Repository](./resources/config-templates.md)
- [Subagent Examples](./resources/subagent-examples.md)
- [Hook Scripting Guide](./resources/hook-scripting.md)
- [MCP Server Catalog](./resources/mcp-servers.md)

## Next Steps

After completing this module, proceed to [Module 6: Team Collaboration and Enterprise Integration](../6-team-collaboration/README.md)
