---
sidebar_position: 4
---

# Discord Configuration

> Quick guide to set up Discord webhooks and receive automatic notifications.

## What's this for?

Discord webhook allows you to receive automatic notifications when:
- The agent updates documentation
- A new documentation PR is created
- You need to review documentation changes

## 3-step configuration

### 1. Create webhook in Discord

1. **Open Discord** and go to your server
2. **Right-click** the channel where you want notifications
3. **Edit Channel** → **Integrations** → **Webhooks**
4. **Create Webhook**
5. **Copy Webhook URL** (save it, you'll need it)

### 2. Add webhook to GitHub

1. **Go to your repository** on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Secret**: Paste your webhook URL

### 3. Verify configuration

The GitHub Actions workflow already includes Discord code. You just need the secret configured.

## Test the webhook

### Manual test

```bash
# Replace YOUR_WEBHOOK_URL with your actual URL
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🧪 Webhook test - It works!"}'
```

If you see the message in Discord, it's configured correctly!

### Test with workflow

1. Make a small change to a `.js` or `.ts` file
2. Create commit and push to a branch
3. Open PR to `main`
4. Check your Discord channel for automatic notification

## Customize notifications

### Basic message format

The message you'll receive has this format:

```
📚 Documentation updated
The agent created a documentation PR

📄 Files changed:
```
src/api.js
src/utils.js
```
```

### Change format

If you want to customize the message, edit this part of the workflow:

```python title="In .github/workflows/docusaurus-auto-docs.yml"
embed = {
    "title": "🤖 Your custom title",
    "description": "Your custom description",
    "color": 0x00ff00,  # Green color
    "fields": [{
        "name": "📂 Modified files",
        "value": f"```\n{os.getenv('CHANGED_FILES', '')}\n```"
    }]
}
```

### Available colors

```python
"color": 0x5865F2,  # Discord blue (default)
"color": 0x00ff00,  # Green
"color": 0xff0000,  # Red
"color": 0xffff00,  # Yellow
"color": 0xff8c00,  # Orange
```

### Team mentions

To mention a specific role:

```python
payload = {
    "content": "<@&ROLE_ID> New documentation to review!",
    "embeds": [embed]
}
```

To get ROLE_ID:
1. In Discord, type `\@role_name`
2. Copy the number that appears
3. Use it instead of `ROLE_ID`

## Multiple channels

If you want notifications in different channels by change type:

1. **Create multiple webhooks** in Discord
2. **Add multiple secrets** in GitHub:
   - `DISCORD_API_WEBHOOK` - For API changes
   - `DISCORD_DOCS_WEBHOOK` - For documentation changes
   - `DISCORD_GENERAL_WEBHOOK` - For everything else

3. **Modify workflow** to use appropriate webhook

## Troubleshooting

### No notifications received

**Verify webhook URL**
```bash
# In GitHub → Settings → Secrets
# Should exist DISCORD_WEBHOOK_URL
```

**Verify Discord permissions**
- Webhook must have permissions to send messages
- Channel must allow webhooks

**Check workflow logs**
- Go to GitHub Actions
- Look for "Notify Discord" step
- Review for errors

### "Invalid Webhook" error

- **Regenerate webhook** in Discord
- **Update secret** in GitHub
- **Verify** no extra spaces in URL

### Too many notifications

```python
# Add condition in workflow
if len(changed_files.split()) > 10:
    # Don't notify if too many files changed
    exit(0)
```

### Rate limiting

Discord limits webhooks to 30 messages per minute. If you have many PRs:

```python
import time
time.sleep(2)  # Wait 2 seconds between notifications
```

## Advanced configuration

### Work hours only notifications

```python
from datetime import datetime

hour = datetime.now().hour
if not (9 <= hour <= 18):  # Only between 9 AM and 6 PM
    exit(0)
```

### Different formats by weekday

```python
from datetime import datetime

if datetime.now().weekday() == 4:  # Friday
    embed["title"] = "🎉 Documentation updated - Have a great weekend!"
```

### Include statistics

```python
embed["fields"].append({
    "name": "📊 Statistics",
    "value": f"Files: {len(files)}\nLines: {total_lines}"
})
```

## Next step

With Discord configured:

1. **Test** by making a real code change
2. **Verify** you receive notification
3. **Continue with** [Complete Testing](/docs/setup/testing)

---

*Discord configured! Your team will always be informed about documentation changes.*