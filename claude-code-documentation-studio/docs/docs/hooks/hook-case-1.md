---
sidebar_position: 2
---

# Hook Case 1: Discord Notifications Hook

> Automated Discord notifications when the Docusaurus Expert agent creates documentation pull requests.

## What are Claude Code Hooks?

Claude Code hooks are event-driven automation scripts that execute at specific points in your development workflow. They allow you to:

- **React to events** like file edits, commits, or tool usage
- **Automate repetitive tasks** without manual intervention
- **Integrate external services** like Discord, Slack, or APIs
- **Enforce policies** and quality gates
- **Create custom workflows** tailored to your team's needs

Think of hooks as **watchers** that monitor your development process and take action when specific events occur.

## Discord Notifications Hook Overview

The Discord Notifications Hook is designed to:

- **Monitor GitHub Actions** for documentation updates
- **Detect PR creation** by the Docusaurus Expert agent
- **Extract PR details** including changed files and descriptions
- **Send rich notifications** to Discord channels
- **Keep teams informed** about documentation changes in real-time

### Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Alerts** | Instant Discord notifications when docs are updated |
| **Rich Embeds** | Beautiful formatted messages with PR details |
| **File Change Lists** | Shows exactly what documentation was modified |
| **Direct Links** | Quick access to review and approve PRs |
| **Team Mentions** | Optional team/role mentions for important updates |

## Hook Configuration

### Step 1: Create the Discord Webhook Hook

First, create the hook script that will send Discord notifications:

```bash
# Create hooks directory
mkdir -p .claude/hooks

# Create the Discord notification hook
touch .claude/hooks/discord-pr-notification.py
```

### Step 2: Discord Notification Script

Here's the complete Discord notification hook:

```python
#!/usr/bin/env python3
"""
Discord PR Notification Hook
Sends notifications to Discord when documentation PRs are created
"""

import json
import sys
import os
import requests
from datetime import datetime

def send_discord_notification(webhook_url, pr_data):
    """Send a rich embed notification to Discord"""

    # Create rich embed for Discord
    embed = {
        "title": "📚 Documentation Updated",
        "description": f"The Docusaurus Expert agent has created a new documentation PR",
        "color": 0x5865F2,  # Discord blurple color
        "timestamp": datetime.utcnow().isoformat(),
        "fields": [
            {
                "name": "📝 Pull Request",
                "value": f"[{pr_data['title']}]({pr_data['url']})",
                "inline": False
            },
            {
                "name": "🔗 Branch",
                "value": pr_data['branch'],
                "inline": True
            },
            {
                "name": "👤 Created by",
                "value": pr_data['author'],
                "inline": True
            },
            {
                "name": "📄 Files Changed",
                "value": f"```\n{pr_data['files']}\n```" if pr_data['files'] else "No specific files listed",
                "inline": False
            }
        ],
        "footer": {
            "text": "Claude Code Documentation Studio",
            "icon_url": "https://avatars.githubusercontent.com/u/anthropics"
        }
    }

    # Add review reminder if needed
    if pr_data.get('needs_review'):
        embed["fields"].append({
            "name": "⚠️ Action Required",
            "value": "This PR needs review and approval to update the documentation site.",
            "inline": False
        })

    payload = {
        "embeds": [embed],
        "username": "Documentation Bot",
        "avatar_url": "https://avatars.githubusercontent.com/u/anthropics"
    }

    # Send to Discord
    try:
        response = requests.post(webhook_url, json=payload, timeout=30)
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"Failed to send Discord notification: {e}", file=sys.stderr)
        return False

def extract_pr_info_from_github_context():
    """Extract PR information from GitHub Actions context"""

    # Get GitHub event data from environment
    github_event_path = os.getenv('GITHUB_EVENT_PATH')
    github_repository = os.getenv('GITHUB_REPOSITORY', 'unknown/repo')
    github_run_id = os.getenv('GITHUB_RUN_ID', '0')

    pr_data = {
        'title': 'Documentation Update',
        'url': f"https://github.com/{github_repository}/actions/runs/{github_run_id}",
        'branch': 'docs/auto-update',
        'author': 'claude-code[bot]',
        'files': '',
        'needs_review': True
    }

    # Try to read GitHub event data
    if github_event_path and os.path.exists(github_event_path):
        try:
            with open(github_event_path, 'r') as f:
                event_data = json.load(f)

            # Extract PR details if available
            if 'pull_request' in event_data:
                pr = event_data['pull_request']
                pr_data.update({
                    'title': pr.get('title', 'Documentation Update'),
                    'url': pr.get('html_url', pr_data['url']),
                    'branch': pr.get('head', {}).get('ref', pr_data['branch']),
                    'author': pr.get('user', {}).get('login', pr_data['author'])
                })
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not parse GitHub event data: {e}", file=sys.stderr)

    return pr_data

def main():
    """Main hook execution"""
    try:
        # Get Discord webhook URL from environment
        webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
        if not webhook_url:
            print("No Discord webhook URL configured", file=sys.stderr)
            sys.exit(0)  # Exit gracefully, don't fail the workflow

        # Read hook input from stdin
        hook_input = json.load(sys.stdin)

        # Extract PR information
        pr_data = extract_pr_info_from_github_context()

        # Add any changed files from hook input
        if 'changed_files' in hook_input:
            pr_data['files'] = '\n'.join(hook_input['changed_files'])

        # Send Discord notification
        success = send_discord_notification(webhook_url, pr_data)

        if success:
            print("✅ Discord notification sent successfully")
        else:
            print("❌ Failed to send Discord notification")

    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Hook execution error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### Step 3: Make Hook Executable

```bash
# Make the hook executable
chmod +x .claude/hooks/discord-pr-notification.py

# Test the hook script
python3 .claude/hooks/discord-pr-notification.py
```

## Discord Webhook Setup

### Step 1: Create Discord Webhook

1. **Open Discord** and navigate to your server
2. **Go to Server Settings** → Integrations → Webhooks
3. **Create Webhook** for your documentation channel
4. **Copy the Webhook URL** - you'll need this for configuration

### Step 2: Configure Webhook URL

Add the webhook URL to your environment:

```bash
# For local testing
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"

# For GitHub Actions (add as repository secret)
# Settings → Secrets and variables → Actions
# Name: DISCORD_WEBHOOK_URL
# Value: https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
```

### Step 3: Test Webhook Locally

Create a test script to verify your webhook works:

```python
# test-discord-hook.py
import json
import subprocess

# Test data
test_input = {
    "changed_files": [
        "docs/api/users.md",
        "docs/guides/authentication.md"
    ]
}

# Run the hook with test data
process = subprocess.run(
    ['python3', '.claude/hooks/discord-pr-notification.py'],
    input=json.dumps(test_input),
    text=True,
    capture_output=True
)

print("Exit code:", process.returncode)
print("Output:", process.stdout)
if process.stderr:
    print("Errors:", process.stderr)
```

## Claude Code Hook Integration

### Step 1: Configure Hook in Settings

Add the Discord hook to your Claude Code settings:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/discord-pr-notification.py",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Step 2: Hook Trigger Events

The Discord hook can be triggered by various events:

| Event | When it Triggers | Use Case |
|-------|------------------|----------|
| **Stop** | After agent completes documentation updates | Final notification |
| **PostToolUse** | After specific tools (Write, Edit) | File-specific updates |
| **Notification** | When Claude sends notifications | Status updates |
| **SessionEnd** | When Claude session ends | Workflow completion |

### Step 3: Enhanced Hook Configuration

For more sophisticated notifications, configure multiple trigger points:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/discord-pr-notification.py",
            "timeout": 30
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Documentation workflow completed' | $CLAUDE_PROJECT_DIR/.claude/hooks/discord-pr-notification.py"
          }
        ]
      }
    ]
  }
}
```

## GitHub Actions Integration

### Step 1: Add Hook to Workflow

Modify your GitHub Actions workflow to trigger the Discord hook:

```yaml
# .github/workflows/docusaurus-auto-docs.yml
- name: Send Discord notification
  if: always()  # Run even if previous steps fail
  run: |
    echo '{"changed_files": ["${{ steps.changed.outputs.files }}"], "workflow": "documentation-update"}' | \
    python3 .claude/hooks/discord-pr-notification.py
  env:
    DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
    GITHUB_EVENT_PATH: ${{ github.event_path }}
```

### Step 2: Environment Variables

Ensure these environment variables are available:

```yaml
env:
  DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
  GITHUB_REPOSITORY: ${{ github.repository }}
  GITHUB_RUN_ID: ${{ github.run_id }}
  GITHUB_EVENT_PATH: ${{ github.event_path }}
```

### Step 3: Conditional Notifications

Send notifications only for successful documentation updates:

```yaml
- name: Notify Discord on success
  if: steps.create-pr.outputs.pull-request-number != ''
  run: |
    echo '{
      "pr_number": "${{ steps.create-pr.outputs.pull-request-number }}",
      "pr_url": "${{ steps.create-pr.outputs.pull-request-url }}",
      "changed_files": "${{ steps.changed.outputs.files }}"
    }' | python3 .claude/hooks/discord-pr-notification.py
```

## Advanced Notification Features

### Custom Message Formatting

Customize Discord messages based on the type of changes:

```python
def format_message_by_change_type(files_changed):
    """Customize message based on files changed"""

    if any('api/' in f for f in files_changed):
        return {
            "title": "🔧 API Documentation Updated",
            "color": 0xf39c12  # Orange for API changes
        }
    elif any('guide/' in f for f in files_changed):
        return {
            "title": "📖 User Guides Updated",
            "color": 0x27ae60  # Green for guides
        }
    else:
        return {
            "title": "📚 Documentation Updated",
            "color": 0x5865F2  # Default blue
        }
```

### Team Mentions

Add team mentions for important updates:

```python
def get_team_mentions(files_changed):
    """Determine which teams to mention"""
    mentions = []

    if any('api/' in f for f in files_changed):
        mentions.append("<@&API_TEAM_ROLE_ID>")

    if any('security/' in f for f in files_changed):
        mentions.append("<@&SECURITY_TEAM_ROLE_ID>")

    return " ".join(mentions)

# In your Discord payload
payload = {
    "content": get_team_mentions(changed_files),
    "embeds": [embed]
}
```

### Error Handling and Retries

Add robust error handling with retries:

```python
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def send_with_retry(webhook_url, payload, max_retries=3):
    """Send Discord notification with retry logic"""

    session = requests.Session()
    retry_strategy = Retry(
        total=max_retries,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504]
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)

    try:
        response = session.post(webhook_url, json=payload, timeout=30)
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"Failed after {max_retries} retries: {e}", file=sys.stderr)
        return False
```

## Testing Your Hook

### Local Testing

Test the complete hook locally:

```bash
# 1. Set environment variables
export DISCORD_WEBHOOK_URL="your-webhook-url"

# 2. Create test input
echo '{"changed_files": ["docs/api/users.md"]}' | \
  python3 .claude/hooks/discord-pr-notification.py

# 3. Check Discord for the notification
```

### Integration Testing

Test with Claude Code:

```bash
# Trigger the hook through Claude Code
claude "Use docusaurus-expert agent to update documentation for the new user profile feature"

# The hook should automatically send a Discord notification
```

### GitHub Actions Testing

Create a test PR to verify the complete workflow:

```bash
# 1. Make a small code change
echo "// Test comment" >> src/utils/helpers.js

# 2. Commit and push
git add .
git commit -m "test: trigger documentation workflow"
git push origin feature/test-docs

# 3. Create PR and check for Discord notification
```

## Troubleshooting

### Common Issues

**Hook not executing**
```bash
# Check hook permissions
ls -la .claude/hooks/discord-pr-notification.py

# Should show executable permissions (-rwxr-xr-x)
```

**Discord webhook failing**
```bash
# Test webhook URL manually
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

**Missing environment variables**
```bash
# In GitHub Actions, verify secrets are set
# Settings → Secrets and variables → Actions
# Should show DISCORD_WEBHOOK_URL
```

**JSON parsing errors**
```bash
# Test hook input format
echo '{"test": "data"}' | python3 .claude/hooks/discord-pr-notification.py
```

## Next Steps

Now that you have Discord notifications set up:

1. **Test the complete workflow** with a real code change
2. **Customize notifications** for your team's needs
3. **Set up additional hooks** for other events
4. **Configure team mentions** for different types of changes

Continue with [Workflows CI/CD](/docs/workflows/cicd-workflow) to see how this all comes together in a complete automated pipeline.

---

*Ready to keep your team informed? Discord notifications ensure everyone knows when documentation is updated automatically.*