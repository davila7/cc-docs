---
sidebar_position: 1
---

# Overview

> Automate actions when Claude Code events happen - like sending notifications when documentation is updated.

Hooks are simple scripts that run automatically when Claude Code does something. Think of them as "if this happens, then do that" automation.

<img width="673" height="583" alt="Screenshot 2025-09-28 at 15 13 52" src="https://github.com/user-attachments/assets/d3e0e19e-1802-4a0b-a8a7-68bbce44c6fd" />

## What are hooks?

Hooks are scripts that:
* **Trigger automatically** when Claude Code events happen
* **Receive information** about what just happened
* **Can send notifications** to Discord, Slack, email, etc.
* **Run custom commands** like formatting code or running tests

## When do hooks run?

| Event | When it happens | Example use |
|:------|:---------------|:------------|
| **PreToolUse** | Before Claude uses any tool | Backup files, validate permissions |
| **PostToolUse** | After Claude uses a tool | Format code, run tests, notify |
| **UserPromptSubmit** | When user sends a message | Log requests, validate input |
| **Stop** | Claude finishes a task | Send completion notifications |
| **SessionStart** | Claude session begins | Initialize logging, setup |
| **SessionEnd** | Claude session ends | Cleanup, send reports |

## Simple example

Create a hook that prints a message when Claude finishes:

```bash
# Create hooks folder
mkdir -p .claude/hooks

# Create simple hook
cat > .claude/hooks/done.py << 'EOF'
#!/usr/bin/env python3
import json
import sys

data = json.load(sys.stdin)
print("✅ Claude finished a task!")
sys.exit(0)
EOF

chmod +x .claude/hooks/done.py
```

Then configure it in Claude settings:
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{"type": "command", "command": ".claude/hooks/done.py"}]
    }]
  }
}
```

## Hook results

Your hook tells Claude what to do next based on its exit code:

* **Exit 0**: ✅ Everything good, continue
* **Exit 1**: ❌ Stop! Something's wrong
* **Other**: ⚠️ Warning, but continue

## What's next?

Now that you understand hooks basics, let's create a practical one:

**[Discord Notifications Hook](/docs/hooks/discord-notification-hook)** - Get notified in Discord when the Docusaurus Expert agent updates your documentation.

---

*Ready to automate your workflow with hooks!*
