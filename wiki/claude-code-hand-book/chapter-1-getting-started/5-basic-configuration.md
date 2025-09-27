# Basic Configuration

> Configure Claude Code with global and project-level settings, and environment variables.

Claude Code offers a variety of settings to configure its behavior to meet your needs. You can configure Claude Code by running the `/config` command when using the interactive REPL.

## Settings files

The `settings.json` file is our official mechanism for configuring Claude
Code through hierarchical settings:

* **User settings** are defined in `~/.claude/settings.json` and apply to all
  projects.
* **Project settings** are saved in your project directory:
  * `.claude/settings.json` for settings that are checked into source control and shared with your team
  * `.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore `.claude/settings.local.json` when it is created.
* For enterprise deployments of Claude Code, we also support **enterprise
  managed policy settings**. These take precedence over user and project
  settings. System administrators can deploy policies to:
  * macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
  * Linux and WSL: `/etc/claude-code/managed-settings.json`
  * Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

```JSON Example settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

> **Author's Recommendation:**
>
> I recommend keeping your `.claude/settings.json` file in version control. This will help you share your configuration with your team and ensure that everyone is using the same settings.

## IDE Integration

Claude Code works great with any Integrated Development Environment (IDE) that has a terminal. Just run `claude`, and you're ready to go.

In addition, Claude Code provides dedicated integrations for popular IDEs, which provide features like interactive diff viewing, selection context sharing, and more. These integrations currently exist for:

* **Visual Studio Code** (including popular forks like Cursor, Windsurf, and VSCodium)
* **JetBrains IDEs** (including IntelliJ, PyCharm, Android Studio, WebStorm, PhpStorm and GoLand)

### Terminal Configuration

Claude cannot control the theme of your terminal. That's handled by your terminal application. You can match Claude Code's theme to your terminal any time via the `/config` command.

For additional customization of the Claude Code interface itself, you can configure a [custom status line](../../chapter-6-configuration/6-statusline.md) to display contextual information like the current model, working directory, or git branch at the bottom of your terminal.

#### Line breaks

You have several options for entering linebreaks into Claude Code:

* **Quick escape**: Type `\` followed by Enter to create a newline
* **Keyboard shortcut**: Set up a keybinding to insert a newline

##### Set up Shift+Enter (VS Code or iTerm2):

Run `/terminal-setup` within Claude Code to automatically configure Shift+Enter.

##### Set up Option+Enter (VS Code, iTerm2 or macOS Terminal.app):

**For Mac Terminal.app:**

1. Open Settings → Profiles → Keyboard
2. Check "Use Option as Meta Key"

**For iTerm2 and VS Code terminal:**

1. Open Settings → Profiles → Keys
2. Under General, set Left/Right Option key to "Esc+"

#### Notification setup

Never miss when Claude completes a task with proper notification configuration:

##### Terminal bell notifications

Enable sound alerts when tasks complete:

```sh
claude config set --global preferredNotifChannel terminal_bell
```

**For macOS users**: Don't forget to enable notification permissions in System Settings → Notifications → \[Your Terminal App].

##### iTerm 2 system notifications

For iTerm 2 alerts when tasks complete:

1. Open iTerm 2 Preferences
2. Navigate to Profiles → Terminal
3. Enable "Silence bell" and Filter Alerts → "Send escape sequence-generated alerts"
4. Set your preferred notification delay

Note that these notifications are specific to iTerm 2 and not available in the default macOS Terminal.

##### Custom notification hooks

For advanced notification handling, you can create [notification hooks](../../chapter-3-advanced-features-and-sdk/1-hooks.md#notification) to run your own logic.

#### Handling large inputs

When working with extensive code or long instructions:

* **Avoid direct pasting**: Claude Code may struggle with very long pasted content
* **Use file-based workflows**: Write content to a file and ask Claude to read it
* **Be aware of VS Code limitations**: The VS Code terminal is particularly prone to truncating long pastes

#### Vim Mode

Claude Code supports a subset of Vim keybindings that can be enabled with `/vim` or configured via `/config`.

The supported subset includes:

* Mode switching: `Esc` (to NORMAL), `i`/`I`, `a`/`A`, `o`/`O` (to INSERT)
* Navigation: `h`/`j`/`k`/`l`, `w`/`e`/`b`, `0`/`$`/`^`, `gg`/`G`
* Editing: `x`, `dw`/`de`/`db`/`dd`/`D`, `cw`/`ce`/`cb`/`cc`/`C`, `.` (repeat)
