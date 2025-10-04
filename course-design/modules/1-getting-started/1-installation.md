# Installation Guide

## Prerequisites

Before installing Claude Code, ensure you have:

- A terminal or command prompt
- One of the following:
  - **Node.js 18 or newer** ([Download Node.js](https://nodejs.org/en/download/))
  - OR a system that supports native installation (macOS, Linux, Windows, WSL)

## Installation Methods

### Method 1: NPM Install (Recommended for Node.js users)

If you have Node.js installed:

```bash
npm install -g @anthropic-ai/claude-code
```

**Verify installation:**

```bash
claude --version
```

You should see the version number displayed.

### Method 2: Native Install (Beta)

The native installer doesn't require Node.js and provides a standalone binary.

#### macOS, Linux, WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

#### Windows CMD

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**Verify installation:**

```bash
claude --version
```

## Troubleshooting Installation

### Common Issues

**Issue: "command not found: claude"**

- **NPM Install:** Ensure npm global bin directory is in your PATH
  ```bash
  npm config get prefix
  # Add the bin directory to your PATH
  ```

- **Native Install:** Restart your terminal or reload your shell configuration

**Issue: Permission denied**

- **NPM Install:** Use `sudo` (macOS/Linux) or run as Administrator (Windows)
  ```bash
  sudo npm install -g @anthropic-ai/claude-code
  ```

**Issue: Node.js version too old**

- Update Node.js to version 18 or newer
- Or use the native installer instead

### Verification Checklist

- [ ] Installation command completed without errors
- [ ] `claude --version` displays version number
- [ ] `claude --help` shows command options
- [ ] You can run `claude` command from any directory

## Next Steps

Once installation is verified, proceed to [Authentication Setup](./2-authentication.md) to configure your account access.

## Additional Resources

- [Official Installation Documentation](https://docs.anthropic.com/claude/docs/quickstart#step-1-install-claude-code)
- [Node.js Installation Guide](https://nodejs.org/en/download/)
- [Troubleshooting Guide](./troubleshooting.md)
