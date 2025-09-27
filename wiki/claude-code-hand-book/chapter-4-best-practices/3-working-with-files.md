# Working with Files

Claude Code provides several tools for working with files. Here are some best practices for using these tools:

*   **Use absolute paths:** When referring to files, always use absolute paths to avoid ambiguity.
*   **Use the `read_file` tool to examine files:** Before making any changes to a file, use the `read_file` tool to examine its content. This will help you understand the file and avoid making unintended changes.
*   **Use the `write_file` tool to create new files:** When creating a new file, use the `write_file` tool. This will create the file and write the content to it in a single step.
*   **Use the `replace` tool for targeted edits:** When you need to make a targeted edit to a file, use the `replace` tool. This tool allows you to replace a specific string in a file with a new string.
*   **Use the `list_directory` tool to explore the file system:** The `list_directory` tool is useful for exploring the file system and finding files.