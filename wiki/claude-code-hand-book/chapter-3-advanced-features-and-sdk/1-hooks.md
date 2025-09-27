# Hooks

> Learn how to customize and extend Claude Code's behavior by registering shell commands

Claude Code hooks are user-defined shell commands that execute at various points
in Claude Code's lifecycle. Hooks provide deterministic control over Claude
Code's behavior, ensuring certain actions always happen rather than relying on
the LLM to choose to run them.

This document provides a complete reference for implementing hooks in Claude Code.

## Configuration

Claude Code hooks are configured in your [settings files](../../chapter-1-getting-started/5-basic-configuration.md#settings-files):

* `~/.claude/settings.json` - User settings
* `.claude/settings.json` - Project settings
* `.claude/settings.local.json` - Local project settings (not committed)
* Enterprise managed policy settings

### Structure

Hooks are organized by matchers, where each matcher can have multiple hooks:

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

* **matcher**: Pattern to match tool names, case-sensitive (only applicable for
  `PreToolUse` and `PostToolUse`)
  * Simple strings match exactly: `Write` matches only the Write tool
  * Supports regex: `Edit|Write` or `Notebook.*`
  * Use `*` to match all tools. You can also use empty string (`""`) or leave
    `matcher` blank.
* **hooks**: Array of commands to execute when the pattern matches
  * `type`: Currently only `"command"` is supported
  * `command`: The bash command to execute (can use `$CLAUDE_PROJECT_DIR`
    environment variable)
  * `timeout`: (Optional) How long a command should run, in seconds, before
    canceling that specific command.

For events like `UserPromptSubmit`, `Notification`, `Stop`, and `SubagentStop`
that don't use matchers, you can omit the matcher field:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

### Project-Specific Hook Scripts

You can use the environment variable `CLAUDE_PROJECT_DIR` (only available when
Claude Code spawns the hook command) to reference scripts stored in your project,
ensuring they work regardless of Claude's current directory:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Events

### PreToolUse

Runs after Claude creates tool parameters and before processing the tool call.

**Common matchers:**

* `Task` - Subagent tasks (see [subagents documentation](../../chapter-2-core-concepts-and-common-workflows/5-subagents.md))
* `Bash` - Shell commands
* `Glob` - File pattern matching
* `Grep` - Content search
* `Read` - File reading
* `Edit`, `MultiEdit` - File editing
* `Write` - File writing
* `WebFetch`, `WebSearch` - Web operations

### PostToolUse

Runs immediately after a tool completes successfully.

Recognizes the same matcher values as PreToolUse.

### Notification

Runs when Claude Code sends notifications. Notifications are sent when:

1. Claude needs your permission to use a tool. Example: "Claude needs your
   permission to use Bash"
2. The prompt input has been idle for at least 60 seconds. "Claude is waiting
   for your input"

### UserPromptSubmit

Runs when the user submits a prompt, before Claude processes it. This allows you
to add additional context based on the prompt/conversation, validate prompts, or
block certain types of prompts.

### Stop

Runs when the main Claude Code agent has finished responding. Does not run if
the stoppage occurred due to a user interrupt.

### SubagentStop

Runs when a Claude Code subagent (Task tool call) has finished responding.

### PreCompact

Runs before Claude Code is about to run a compact operation.

**Matchers:**

* `manual` - Invoked from `/compact`
* `auto` - Invoked from auto-compact (due to full context window)

### SessionStart

Runs when Claude Code starts a new session or resumes an existing session (which
currently does start a new session under the hood). Useful for loading in
development context like existing issues or recent changes to your codebase.

**Matchers:**

* `startup` - Invoked from startup
* `resume` - Invoked from `--resume`, `--continue`, or `/resume`
* `clear` - Invoked from `/clear`
* `compact` - Invoked from auto or manual compact.

### SessionEnd

Runs when a Claude Code session ends. Useful for cleanup tasks, logging session
statistics, or saving session state.

The `reason` field in the hook input will be one of:

* `clear` - Session cleared with /clear command
* `logout` - User logged out
* `prompt_input_exit` - User exited while prompt input was visible
* `other` - Other exit reasons

## Hook Input

Hooks receive JSON data via stdin containing session information and
event-specific data:

```typescript
{
  // Common fields
  session_id: string
  transcript_path: string  // Path to conversation JSON
  cwd: string              // The current working directory when the hook is invoked

  // Event-specific fields
  hook_event_name: string
  ...
}
```

### Hook Output

There are two ways for hooks to return output back to Claude Code. The output
communicates whether to block and any feedback that should be shown to Claude
and the user.

### Simple: Exit Code

Hooks communicate status through exit codes, stdout, and stderr:

* **Exit code 0**: Success. `stdout` is shown to the user in transcript mode
  (CTRL-R), except for `UserPromptSubmit` and `SessionStart`, where stdout is
  added to the context.
* **Exit code 2**: Blocking error. `stderr` is fed back to Claude to process
  automatically. See per-hook-event behavior below.
* **Other exit codes**: Non-blocking error. `stderr` is shown to the user and
  execution continues.

<Warning>
  Reminder: Claude Code does not see stdout if the exit code is 0, except for
  the `UserPromptSubmit` hook where stdout is injected as context.
</Warning>

#### Exit Code 2 Behavior

| Hook Event         | Behavior                                                           |
| ------------------ | ------------------------------------------------------------------ |
| `PreToolUse`       | Blocks the tool call, shows stderr to Claude                       |
| `PostToolUse`      | Shows stderr to Claude (tool already ran)                          |
| `Notification`     | N/A, shows stderr to user only                                     |
| `UserPromptSubmit` | Blocks prompt processing, erases prompt, shows stderr to user only |
| `Stop`             | Blocks stoppage, shows stderr to Claude                            |
| `SubagentStop`     | Blocks stoppage, shows stderr to Claude subagent                   |
| `PreCompact`       | N/A, shows stderr to user only                                     |
| `SessionStart`     | N/A, shows stderr to user only                                     |
| `SessionEnd`       | N/A, shows stderr to user only                                     |

### Advanced: JSON Output

Hooks can return structured JSON in `stdout` for more sophisticated control:

#### Common JSON Fields

All hook types can include these optional fields:

```json
{
  "continue": true, // Whether Claude should continue after hook execution (default: true)
  "stopReason": "string", // Message shown when continue is false

  "suppressOutput": true, // Hide stdout from transcript mode (default: false)
  "systemMessage": "string" // Optional warning message shown to the user
}
```

If `continue` is false, Claude stops processing after the hooks run.

* For `PreToolUse`, this is different from `"permissionDecision": "deny"`, which
  only blocks a specific tool call and provides automatic feedback to Claude.
* For `PostToolUse`, this is different from `"decision": "block"`, which
  provides automated feedback to Claude.
* For `UserPromptSubmit`, this prevents the prompt from being processed.
* For `Stop` and `SubagentStop`, this takes precedence over any
  `"decision": "block"` output.
* In all cases, `"continue" = false` takes precedence over any
  `"decision": "block"` output.

`stopReason` accompanies `continue` with a reason shown to the user, not shown
to Claude.

#### `PreToolUse` Decision Control

`PreToolUse` hooks can control whether a tool call proceeds.

* `"allow"` bypasses the permission system. `permissionDecisionReason` is shown
  to the user but not to Claude.
* `"deny"` prevents the tool call from executing. `permissionDecisionReason` is
  shown to Claude.
* `"ask"` asks the user to confirm the tool call in the UI.
  `permissionDecisionReason` is shown to the user but not to Claude.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow" | "deny" | "ask",
    "permissionDecisionReason": "My reason here"
  }
}
```

<Note>
  The `decision` and `reason` fields are deprecated for PreToolUse hooks.
  Use `hookSpecificOutput.permissionDecision` and
  `hookSpecificOutput.permissionDecisionReason` instead. The deprecated fields
  `"approve"` and `"block"` map to `"allow"` and `"deny"` respectively.
</Note>

#### `PostToolUse` Decision Control

`PostToolUse` hooks can provide feedback to Claude after tool execution.

* `"block"` automatically prompts Claude with `reason`.
* `undefined` does nothing. `reason` is ignored.
* `"hookSpecificOutput.additionalContext"` adds context for Claude to consider.

```json
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Additional information for Claude"
  }
}
```

#### `UserPromptSubmit` Decision Control

`UserPromptSubmit` hooks can control whether a user prompt is processed.

* `"block"` prevents the prompt from being processed. The submitted prompt is
  erased from context. `"reason"` is shown to the user but not added to context.
* `undefined` allows the prompt to proceed normally. `"reason"` is ignored.
* `"hookSpecificOutput.additionalContext"` adds the string to the context if not
  blocked.

```json
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here"
  }
}
```

#### `Stop`/`SubagentStop` Decision Control

`Stop` and `SubagentStop` hooks can control whether Claude must continue.

* `"block"` prevents Claude from stopping. You must populate `reason` for Claude
  to know how to proceed.
* `undefined` allows Claude to stop. `reason` is ignored.

```json
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

#### `SessionStart` Decision Control

`SessionStart` hooks allow you to load in context at the start of a session.

* `"hookSpecificOutput.additionalContext"` adds the string to the context.
* Multiple hooks' `additionalContext` values are concatenated.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "My additional context here"
  }
}
```

#### `SessionEnd` Decision Control

`SessionEnd` hooks run when a session ends. They cannot block session termination
but can perform cleanup tasks.

## Security Considerations

### Disclaimer

**USE AT YOUR OWN RISK**: Claude Code hooks execute arbitrary shell commands on
your system automatically. By using hooks, you acknowledge that:

* You are solely responsible for the commands you configure
* Hooks can modify, delete, or access any files your user account can access
* Malicious or poorly written hooks can cause data loss or system damage
* Anthropic provides no warranty and assumes no liability for any damages
  resulting from hook usage
* You should thoroughly test hooks in a safe environment before production use

Always review and understand any hook commands before adding them to your
configuration.

### Security Best Practices

Here are some key practices for writing more secure hooks:

1. **Validate and sanitize inputs** - Never trust input data blindly
2. **Always quote shell variables** - Use `"$VAR"` not `$VAR`
3. **Block path traversal** - Check for `..` in file paths
4. **Use absolute paths** - Specify full paths for scripts (use
   `$CLAUDE_PROJECT_DIR` for the project path)
5. **Skip sensitive files** - Avoid `.env`, `.git/`, keys, etc.

### Configuration Safety

Direct edits to hooks in settings files don't take effect immediately. Claude
Code:

1. Captures a snapshot of hooks at startup
2. Uses this snapshot throughout the session
3. Warns if hooks are modified externally
4. Requires review in `/hooks` menu for changes to apply

This prevents malicious hook modifications from affecting your current session.

## Debugging

### Basic Troubleshooting

If your hooks aren't working:

1. **Check configuration** - Run `/hooks` to see if your hook is registered
2. **Verify syntax** - Ensure your JSON settings are valid
3. **Test commands** - Run hook commands manually first
4. **Check permissions** - Make sure scripts are executable
5. **Review logs** - Use `claude --debug` to see hook execution details

Common issues:

* **Quotes not escaped** - Use `\"` inside JSON strings
* **Wrong matcher** - Check tool names match exactly (case-sensitive)
* **Command not found** - Use full paths for scripts

### Advanced Debugging

For complex hook issues:

1. **Inspect hook execution** - Use `claude --debug` to see detailed hook
   execution
2. **Validate JSON schemas** - Test hook input/output with external tools
3. **Check environment variables** - Verify Claude Code's environment is correct
4. **Test edge cases** - Try hooks with unusual file paths or inputs
5. **Monitor system resources** - Check for resource exhaustion during hook
   execution
6. **Use structured logging** - Implement logging in your hook scripts