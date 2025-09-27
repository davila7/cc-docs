# Shell Commands

Claude Code allows you to execute shell commands using the `run_shell_command` tool. Here are some best practices for using this tool:

*   **Be careful with destructive commands:** Be careful when using destructive commands like `rm` and `mv`. Always double-check your commands before executing them.
*   **Use the `description` parameter:** When using the `run_shell_command` tool, always provide a description of the command you are executing. This will help you and others understand the purpose of the command.
*   **Use non-interactive commands:** Whenever possible, use non-interactive versions of commands. For example, use `npm init -y` instead of `npm init`.
*   **Run long-running commands in the background:** If you need to run a long-running command, run it in the background by appending `&` to the command.