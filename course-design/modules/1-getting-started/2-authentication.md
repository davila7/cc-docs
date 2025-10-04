# Authentication Setup

## Overview

Claude Code requires authentication to use. You can authenticate with either a Claude.ai account or an Anthropic Console account.

## Account Types

### Claude.ai (Recommended)

- **Best for:** Individual developers, small teams
- **Pricing:** Subscription plans (Free, Pro, Team)
- **Sign up:** [claude.ai](https://claude.ai)

### Anthropic Console

- **Best for:** API users, enterprise deployments
- **Pricing:** Pay-as-you-go with pre-paid credits
- **Sign up:** [console.anthropic.com](https://console.anthropic.com/)

> **Note:** You can have both account types under the same email address.

## Authentication Process

### First-Time Authentication

1. **Start Claude Code in any directory:**

```bash
cd /path/to/your/project
claude
```

2. **You'll see a login prompt:**

```
✻ Welcome to Claude Code!

Please log in to continue...
```

3. **Follow the authentication flow:**
   - A browser window will open
   - Select your account type (Claude.ai or Anthropic Console)
   - Complete the login process
   - Return to your terminal

4. **Confirmation:**

```
✓ Successfully authenticated!
```

### Manual Login Command

You can also trigger login manually at any time:

```bash
claude
> /login
```

Or from the command line:

```bash
claude -p "/login"
```

### Switching Accounts

To switch between accounts or log in with a different account:

```bash
# In an interactive session
> /login

# From command line
claude -p "/login"
```

## Credential Storage

Once authenticated, your credentials are securely stored on your system:

- **macOS/Linux:** `~/.claude/credentials`
- **Windows:** `%USERPROFILE%\.claude\credentials`

You won't need to log in again unless:
- You explicitly log out
- Your session expires
- You switch devices

## Workspace Creation (Anthropic Console)

When you first authenticate with an Anthropic Console account:

- A workspace called **"Claude Code"** is automatically created
- This workspace provides:
  - Centralized cost tracking
  - Usage management
  - Team organization

## Verification

Verify your authentication status:

```bash
# Check if authenticated
claude -p "who am I logged in as?"

# Or check session status
claude
> /status
```

## Security Best Practices

1. **Never share credentials** - Your authentication tokens are personal
2. **Secure your machine** - Credentials are stored locally
3. **Log out on shared devices** - Use `/logout` when using shared computers
4. **Use appropriate account type** - Choose based on your use case:
   - Personal projects → Claude.ai
   - Enterprise/Team → Anthropic Console

## Troubleshooting

### Issue: Browser doesn't open

**Solution:** Copy the authentication URL from terminal and open manually in your browser.

### Issue: Authentication fails

**Solutions:**
1. Ensure you have an active account at claude.ai or console.anthropic.com
2. Check your internet connection
3. Try clearing credentials and re-authenticating:
   ```bash
   rm ~/.claude/credentials
   claude
   ```

### Issue: "Session expired"

**Solution:** Simply run `/login` again to re-authenticate.

## Logout

To remove stored credentials:

```bash
# In interactive session
> /logout

# Or manually delete credentials file
rm ~/.claude/credentials  # macOS/Linux
del %USERPROFILE%\.claude\credentials  # Windows
```

## Next Steps

Now that you're authenticated, learn about different [Command Modes](./3-command-modes.md) to interact with Claude Code.

## Additional Resources

- [Identity and Access Management](https://docs.anthropic.com/claude/docs/iam)
- [Account Types Comparison](https://www.anthropic.com/pricing)
- [Security Documentation](https://docs.anthropic.com/claude/docs/security)
