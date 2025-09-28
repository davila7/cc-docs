---
sidebar_position: 3
---

# Discord Notification Hook

> Create a general-purpose hook that sends Discord notifications for any Claude Code agent activity.

## What does it do?

This hook automatically sends Discord messages when Claude Code agents complete tasks, create PRs, or trigger specific events in your workflows.

<img width="657" height="418" alt="Screenshot 2025-09-27 at 20 59 36" src="https://github.com/user-attachments/assets/bc21b49a-9946-4c83-b0f7-a49816274a71" />

## Create Discord webhook

1. **Open Discord** → Go to your server
2. **Right-click channel** → **Edit Channel** → **Integrations** → **Webhooks**
3. **Create Webhook** → **Copy Webhook URL**
4. 
<img width="717" height="384" alt="Screenshot 2025-09-28 at 11 54 23" src="https://github.com/user-attachments/assets/d113b716-b4ad-4ed6-8a4f-0ed5e29a76a6" />

Test it works:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🧪 Test message"}'
```

## GitHub Actions (Optional)

If using with GitHub Actions, add the webhook URL as a repository secret:

GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add secret:
- **Name**: `DISCORD_WEBHOOK_URL`
- **Value**: Your webhook URL

## Create the hook

Create `.claude/hooks/discord-notifier.py` using only native Python libraries:

```python
#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.parse
import sys
from datetime import datetime

def main():
    webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
    if not webhook_url:
        print("No Discord webhook configured")
        exit(0)

    # Read hook data from stdin (Claude Code passes data this way)
    try:
        hook_data = json.load(sys.stdin)
        hook_event = hook_data.get('hook_event_name', 'Unknown')
        tool_name = hook_data.get('tool_name', 'Unknown Tool')

        # Extract file path or command for context
        tool_input = hook_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '')
        command = tool_input.get('command', '')

        # Determine agent name (Claude Code doesn't directly provide this)
        agent_name = os.getenv('AGENT_NAME', 'Claude Code Agent')

        # Create activity description based on tool and input
        if file_path:
            activity_details = file_path
            activity_title = f"{tool_name}: {os.path.basename(file_path)}"
        elif command:
            activity_details = command[:100] + ('...' if len(command) > 100 else '')
            activity_title = f"{tool_name}: {command.split()[0] if command.split() else 'command'}"
        else:
            activity_details = f"Tool: {tool_name}"
            activity_title = f"Used {tool_name}"

    except Exception as e:
        # Fallback to environment variables
        print(f"Debug: Failed to parse stdin JSON: {e}")
        hook_event = os.getenv('HOOK_EVENT', 'PostToolUse')
        tool_name = os.getenv('TOOL_NAME', 'Unknown Tool')
        agent_name = os.getenv('AGENT_NAME', 'Claude Code Agent')
        activity_title = os.getenv('ACTIVITY_TITLE', f'Used {tool_name}')
        activity_details = os.getenv('ACTIVITY_DETAILS', f'Tool: {tool_name}')

    # Get additional activity info from environment (can override defaults)
    activity_title = os.getenv('ACTIVITY_TITLE', activity_title)
    activity_url = os.getenv('ACTIVITY_URL', '#')
    activity_details = os.getenv('ACTIVITY_DETAILS', activity_details)

    # Create Discord embed
    embed = {
        "title": "🤖 Claude Code Activity",
        "description": f"{agent_name} completed a task",
        "color": 0x5865F2,
        "fields": [
            {
                "name": "⚡ Hook Event",
                "value": f"`{hook_event}`",
                "inline": True
            },
            {
                "name": "🤖 Agent",
                "value": f"{agent_name}",
                "inline": True
            },
            {
                "name": "📋 Activity",
                "value": f"[{activity_title}]({activity_url})"
            },
            {
                "name": "📝 Details",
                "value": f"```\n{activity_details}\n```"
            }
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

    # Send to Discord using native urllib
    payload = {
        "embeds": [embed],
        "username": "Claude Code Bot"
    }

    try:
        # Convert payload to JSON and encode
        data = json.dumps(payload).encode('utf-8')

        # Debug: print payload size
        print(f"Debug: Payload size: {len(data)} bytes")

        # Create request with User-Agent header
        req = urllib.request.Request(
            webhook_url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Claude-Code-Discord-Bot/1.0'
            }
        )

        # Send request
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200 or response.status == 204:
                print("✅ Discord notification sent")
            else:
                print(f"❌ Discord API returned status: {response.status}")

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        if hasattr(e, 'read'):
            error_body = e.read().decode('utf-8')
            print(f"Error details: {error_body}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
```

Make it executable:
```bash
chmod +x .claude/hooks/discord-notifier.py
```

## Complete configuration

Add both the hook and webhook URL to `.claude/settings.json`:

```json
{
  "env": {
    "DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"
  },
  "hooks": {
    "PostToolUse": [{
      "hooks": [{"type": "command", "command": ".claude/hooks/discord-notifier.py"}]
    }]
  }
}
```

**The script automatically extracts:**
- `hook_event_name`: The hook event type (PostToolUse, Stop, etc.)
- `tool_name`: The tool that was used (Read, Write, Edit, etc.)
- `tool_input`: Parameters passed to the tool (file_path, command, etc.)


## Examples of activation

### When Claude finishes using a tool

When Claude completes any tool (Write, Edit, Bash, etc.), the PostToolUse hook triggers:

```json
# User asks: "Create a new component file"
# Claude uses Write tool to create component.js
# PostToolUse hook receives via stdin:
{
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/src/components/component.js",
    "content": "import React from 'react'..."
  }
}
# Result in Discord: "Write: component.js"
```

## Test the hook

1. **Start Claude Code** in your project directory
2. **Ask Claude to make a change**: "Create a test file called hello.txt with 'Hello World'"
3. **Check Discord** - You should see a notification like:

<img width="650" height="303" alt="Screenshot 2025-09-28 at 13 01 11" src="https://github.com/user-attachments/assets/2c0e2623-e50f-4413-92aa-ee8d2a84f1d1" />

## Troubleshooting

**No message in Discord?**
- Check webhook URL is correct
- Verify Discord channel permissions
- Test webhook manually with curl

**Hook fails?**
- Check GitHub Actions logs
- Verify `DISCORD_WEBHOOK_URL` secret exists
- Test hook locally first

## Next step

Your general Discord notification hook is ready! It can now send notifications for any Claude Code agent activity.

Continue with [Complete Workflow](/docs/workflows/cicd-workflow) to see how to connect it specifically with the Docusaurus Expert agent.

---

*Team notifications ready! 🔔*
