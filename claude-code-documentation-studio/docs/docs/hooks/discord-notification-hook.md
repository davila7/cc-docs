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

Test it works:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🧪 Test message"}'
```

## Add to GitHub Secrets

GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add secret:
- **Name**: `DISCORD_WEBHOOK_URL`
- **Value**: Your webhook URL

## Step 3: Create the hook

Create `.claude/hooks/discord-notify.py`:

```python
#!/usr/bin/env python3
import os
import requests
import json
from datetime import datetime

def main():
    webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
    if not webhook_url:
        print("No Discord webhook configured")
        exit(0)

    # Get activity info from environment
    activity_title = os.getenv('ACTIVITY_TITLE', 'Claude Code agent completed task')
    activity_url = os.getenv('ACTIVITY_URL', '#')
    activity_details = os.getenv('ACTIVITY_DETAILS', '').replace(' ', '\n')
    agent_name = os.getenv('AGENT_NAME', 'Claude Code Agent')
    hook_event = os.getenv('HOOK_EVENT', 'Unknown')

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

    # Send to Discord
    payload = {
        "embeds": [embed],
        "username": "Claude Code Bot"
    }

    try:
        response = requests.post(webhook_url, json=payload, timeout=30)
        response.raise_for_status()
        print("✅ Discord notification sent")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
```

Make it executable:
```bash
chmod +x .claude/hooks/discord-notify.py
```

## Test the hook

Test with mock data:

```bash
export DISCORD_WEBHOOK_URL="your-webhook-url"
export HOOK_EVENT="PostToolUse"
export AGENT_NAME="Test Agent"
export ACTIVITY_TITLE="Test agent activity"
export ACTIVITY_URL="https://github.com/your-repo/pull/123"
export ACTIVITY_DETAILS="test-file.js config.json"

python3 .claude/hooks/discord-notify.py
```

You should see a Discord message with:
- **Title**: "🤖 Claude Code Activity"
- **Hook Event**: `PostToolUse` (inline)
- **Agent**: Test Agent (inline)
- **Activity details** and **links**
- **Bot username**: "Claude Code Bot"

## Step 5: Add to workflow

This general hook can be configured for any Claude Code agent workflow. You'll learn how to connect it specifically with the Docusaurus Expert agent in the [Complete Workflow](/docs/workflows/cicd-workflow) section.

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
