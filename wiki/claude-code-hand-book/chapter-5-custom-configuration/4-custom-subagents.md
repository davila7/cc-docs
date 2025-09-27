# Custom Subagents

You can create custom subagents for your project by creating Markdown files in the `.claude/agents/` directory. The name of the file determines the name of the subagent.

Each subagent file must contain a YAML frontmatter with the following fields:

*   **`name`**: The name of the subagent.
*   **`description`**: A description of the subagent.
*   **`tools`**: A list of tools that the subagent can use.

For more information, see the [Subagents documentation](../../chapter-2-core-concepts-and-common-workflows/5-subagents.md).