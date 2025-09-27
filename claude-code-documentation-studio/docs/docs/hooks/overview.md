---
sidebar_position: 1
---

# Hooks

> Automate actions when Claude Code events happen - like sending notifications when documentation is updated.

Hooks are simple scripts that run automatically when Claude Code does something. Think of them as "if this happens, then do that" automation.

<img width="683" height="466" alt="Claude Code Hooks Flow" src="https://github.com/user-attachments/assets/586a21a9-3242-4db8-81fe-abaf6e430ec1" />

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

**[Discord Notifications Hook](/docs/hooks/hook-case-1)** - Get notified in Discord when the Docusaurus Expert agent updates your documentation.

---

*Ready to automate your workflow with hooks!*