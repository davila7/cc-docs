# Automated Documentation Workflows

You can use Claude Code to create automated documentation workflows that generate and update your documentation.

Here is an example of how you can use Claude Code to create an automated documentation workflow:

1.  **Create a script that generates your documentation.** This script should generate your documentation from your source code comments.
2.  **Create a custom slash command that runs the script.** This slash command will run the script and pass the generated documentation to Claude Code.
3.  **Create a custom subagent that reviews the documentation.** This subagent will review the documentation for errors and inconsistencies.
4.  **Create a custom hook that runs the slash command after every commit.** This hook will run the slash command after every commit, so you can keep your documentation up to date.