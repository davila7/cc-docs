# CLI reference

> Complete reference for Claude Code command-line interface, including commands and flags.

## CLI commands

| Command                            | Description                                    | Example                                                            |
| :--------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------- |
| `claude`                           | Start interactive REPL                         | `claude`                                                           |
| `claude "query"`                   | Start REPL with initial prompt                 | `claude "explain this project"`                                    |
| `claude -p "query"`                | Query via SDK, then exit                       | `claude -p "explain this function"`                                |
| `cat file \| claude -p "query"`    | Process piped content                          | `cat logs.txt \| claude -p "explain"`                              |
| `claude -c`                        | Continue most recent conversation              | `claude -c`                                                        |
| `claude -c -p "query"`             | Continue via SDK                               | `claude -c -p "Check for type errors"`                             |
| `claude -r "<session-id>" "query"` | Resume session by ID                           | `claude -r "abc123" "Finish this PR"`                              |
| `claude update`                    | Update to latest version                       | `claude update`                                                    |
| `claude mcp`                       | Configure Model Context Protocol (MCP) servers | See the [Claude Code MCP documentation](../../chapter-2-core-concepts-and-common-workflows/6-mcp.md). |

## CLI flags

Customize Claude Code's behavior with these command-line flags:

| Flag                             | Description                                                                                                                                              | Example                                                     |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `--add-dir`                      | Add additional working directories for Claude to access (validates each path exists as a directory)                                                      | `claude --add-dir ../apps ../lib`                           |
| `--allowedTools`                 | A list of tools that should be allowed without prompting the user for permission, in addition to [settings.json files](5-basic-configuration.md)    | `"Bash(git log:*)" "Bash(git diff:*)" "Read"`               |
| `--disallowedTools`              | A list of tools that should be disallowed without prompting the user for permission, in addition to [settings.json files](5-basic-configuration.md) | `"Bash(git log:*)" "Bash(git diff:*)" "Edit"`               |
| `--print`, `-p`                  | Print response without interactive mode (see [SDK documentation](../../chapter-3-advanced-features-and-sdk/3-sdk-overview.md) for programmatic usage details)                               | `claude -p "query"`                                         |
| `--append-system-prompt`         | Append to system prompt (only with `--print`)                                                                                                            | `claude --append-system-prompt "Custom instruction"`        |
| `--output-format`                | Specify output format for print mode (options: `text`, `json`, `stream-json`)                                                                            | `claude -p "query" --output-format json`                    |
| `--input-format`                 | Specify input format for print mode (options: `text`, `stream-json`)                                                                                     | `claude -p --output-format json --input-format stream-json` |
| `--verbose`                      | Enable verbose logging, shows full turn-by-turn output (helpful for debugging in both print and interactive modes)                                       | `claude --verbose`                                          |
| `--max-turns`                    | Limit the number of agentic turns in non-interactive mode                                                                                                | `claude -p --max-turns 3 "query"`                           |
| `--model`                        | Sets the model for the current session with an alias for the latest model (`sonnet` or `opus`) or a model's full name                                    | `claude --model claude-sonnet-4-20250514`                   |
| `--permission-mode`              | Begin in a specified [permission mode](4-authentication.md#permission-modes)                                                                                             | `claude --permission-mode plan`                             |
| `--permission-prompt-tool`       | Specify an MCP tool to handle permission prompts in non-interactive mode                                                                                 | `claude -p --permission-prompt-tool mcp_auth_tool "query"`  |
| `--resume`                       | Resume a specific session by ID, or by choosing in interactive mode                                                                                      | `claude --resume abc123 "query"`                            |
| `--continue`                     | Load the most recent conversation in the current directory                                                                                               | `claude --continue`                                         |
| `--dangerously-skip-permissions` | Skip permission prompts (use with caution)                                                                                                               | `claude --dangerously-skip-permissions`                     |

> **Author's Recommendation:**
>
> The `--help` flag is your best friend. If you are ever unsure about a command or a flag, just add `--help` to the end of the command to get more information.

<Tip>
  The `--output-format json` flag is particularly useful for scripting and
  automation, allowing you to parse Claude's responses programmatically.
</Tip>

For detailed information about print mode (`-p`) including output formats,
streaming, verbose logging, and programmatic usage, see the
[SDK documentation](../../chapter-3-advanced-features-and-sdk/3-sdk-overview.md).

## See also

* [Interactive mode](../../chapter-2-core-concepts-and-common-workflows/1-interactive-mode.md) - Shortcuts, input modes, and interactive features
* [Slash commands](../../chapter-2-core-concepts-and-common-workflows/2-slash-commands.md) - Interactive session commands
* [Quickstart guide](3-quickstart.md) - Getting started with Claude Code
* [Common workflows](../../chapter-2-core-concepts-and-common-workflows/3-common-workflows.md) - Advanced workflows and patterns
* [Settings](5-basic-configuration.md) - Configuration options
* [SDK documentation](../../chapter-3-advanced-features-and-sdk/3-sdk-overview.md) - Programmatic usage and integrations