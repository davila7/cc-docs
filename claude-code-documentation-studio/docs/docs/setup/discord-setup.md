---
sidebar_position: 4
---

# Discord Webhook Configuration

> Complete guide to setting up Discord webhooks for automated documentation notifications.

## Overview

Discord webhooks allow your automated documentation workflow to send real-time notifications to your team when documentation is updated. This integration provides:

- **Instant notifications** when documentation PRs are created
- **Rich embed messages** with PR details and changed files
- **Direct links** to review and approve documentation updates
- **Team mentions** for important documentation changes

## Prerequisites

Before configuring Discord webhooks, ensure you have:

- **Discord Server**: Admin permissions on the server where you want notifications
- **Documentation Channel**: Dedicated channel for documentation updates (recommended)
- **GitHub Repository**: With the Claude Code workflow already configured

## Step 1: Create Discord Webhook

### 1.1 Access Server Settings

1. **Open Discord** and navigate to your server
2. **Right-click the server name** and select "Server Settings"
3. **Navigate to Integrations** → **Webhooks**

### 1.2 Create New Webhook

1. **Click "Create Webhook"**
2. **Configure webhook settings:**
   - **Name**: `Documentation Bot` (or your preferred name)
   - **Channel**: Select your documentation channel
   - **Avatar**: Optional - upload a bot avatar

### 1.3 Copy Webhook URL

1. **Click "Copy Webhook URL"**
2. **Save the URL securely** - you'll need it for GitHub configuration

The webhook URL format will be:
```
https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
```

:::warning Security Note
Keep your webhook URL private. Anyone with this URL can send messages to your Discord channel.
:::

## Step 2: Configure GitHub Repository

### 2.1 Add Repository Secret

1. **Navigate to your GitHub repository**
2. **Go to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Configure the secret:**
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Secret**: Paste your Discord webhook URL

### 2.2 Verify Secret Configuration

Your repository secrets should now include:
- `ANTHROPIC_API_KEY` (for Claude Code agent)
- `DISCORD_WEBHOOK_URL` (for Discord notifications)

## Step 3: Test Webhook Integration

### 3.1 Manual Webhook Test

Test your webhook manually using curl:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🧪 Testing Discord webhook integration",
    "embeds": [{
      "title": "Test Notification",
      "description": "Webhook is working correctly!",
      "color": 5814783,
      "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
    }]
  }'
```

You should see a test message appear in your Discord channel.

### 3.2 GitHub Actions Test

Create a test commit to trigger the workflow:

```bash
# Make a small change to trigger documentation workflow
echo "// Test comment for webhook" >> src/example.js

# Commit and push
git add .
git commit -m "test: trigger documentation workflow"
git push origin your-feature-branch

# Create pull request to main branch
```

## Step 4: Customize Notifications

### 4.1 Message Formatting

The Discord hook supports rich embed customization. Edit `.claude/hooks/discord-pr-notification.py`:

```python
# Custom embed colors for different types of changes
def get_embed_color(files_changed):
    if any('api/' in f for f in files_changed):
        return 0xf39c12  # Orange for API changes
    elif any('guide/' in f for f in files_changed):
        return 0x27ae60  # Green for guides
    else:
        return 0x5865F2  # Default blue
```

### 4.2 Team Mentions

Add team mentions for important updates:

```python
def get_team_mentions(files_changed):
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

### 4.3 Conditional Notifications

Send notifications only for specific types of changes:

```python
def should_send_notification(files_changed):
    # Only notify for documentation-relevant changes
    doc_extensions = ['.md', '.mdx', '.js', '.ts', '.py']

    return any(
        any(f.endswith(ext) for ext in doc_extensions)
        for f in files_changed
    )
```

## Advanced Configuration

### Multiple Webhooks

Configure different webhooks for different types of notifications:

```yaml
# In GitHub Actions workflow
- name: Send Discord notification
  env:
    DISCORD_WEBHOOK_URL: ${{
      contains(steps.changed.outputs.files, 'api/') &&
      secrets.DISCORD_API_WEBHOOK_URL ||
      secrets.DISCORD_GENERAL_WEBHOOK_URL
    }}
```

### Rate Limiting

Add retry logic for Discord API rate limits:

```python
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def send_with_retry(webhook_url, payload, max_retries=3):
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

## Troubleshooting

### Common Issues

**Webhook not receiving messages**
```bash
# Verify webhook URL is correct
curl -X POST "YOUR_WEBHOOK_URL" -H "Content-Type: application/json" -d '{"content": "test"}'

# Check GitHub Actions logs for error messages
```

**Discord API rate limiting**
```bash
# Check response headers for rate limit information
# Implement exponential backoff in your hook script
```

**Missing notifications**
```bash
# Verify GitHub repository secrets are set
# Check GitHub Actions workflow execution logs
# Ensure Discord webhook URL has proper permissions
```

**JSON parsing errors**
```bash
# Test hook input format locally
echo '{"test": "data"}' | python3 .claude/hooks/discord-pr-notification.py
```

### Debug Mode

Enable debug logging in your Discord hook:

```python
import logging

# Add to the beginning of your hook script
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def send_discord_notification(webhook_url, pr_data):
    logger.debug(f"Sending notification with data: {pr_data}")
    # ... rest of function
```

## Security Best Practices

### Webhook URL Protection

- **Never commit webhook URLs** to your repository
- **Use GitHub Secrets** for all sensitive configuration
- **Rotate webhook URLs** periodically
- **Monitor webhook usage** in Discord audit logs

### Access Control

- **Limit webhook permissions** to specific channels
- **Use dedicated service accounts** for automation
- **Review team access** to repository secrets regularly

## Next Steps

Now that Discord notifications are configured:

1. **Test the complete workflow** with a real code change
2. **Customize notification content** for your team's needs
3. **Set up additional channels** for different types of updates
4. **Configure team mentions** for critical documentation changes

Continue with [End-to-End Testing](/docs/setup/testing) to verify your complete documentation automation pipeline.

---

*Stay connected with your team! Discord notifications ensure everyone knows when documentation is updated automatically.*