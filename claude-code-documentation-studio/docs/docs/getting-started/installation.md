---
sidebar_position: 2
---

# Installation & Setup

This guide walks you through setting up your development environment for advanced Claude Code subagents and hooks integration patterns.

## Prerequisites

Before implementing advanced patterns, ensure you have:

### Claude Code
- ✅ Claude Code installed and working
- ✅ Valid Anthropic API access
- ✅ Basic familiarity with Claude Code commands

### Development Environment
- ✅ **Node.js 18+** for JavaScript/TypeScript workflows
- ✅ **Python 3.8+** for hook scripts
- ✅ **Git** for version control
- ✅ **Shell environment** (bash, zsh) for hook execution

### Optional Tools
- 🔧 **jq** for JSON processing in hooks
- 🔧 **prettier** for automatic code formatting
- 🔧 **black** for Python code formatting
- 🔧 **ESLint** for JavaScript/TypeScript linting

## Project Setup

### 1. Create Project Directory Structure

```bash
# Create your project with Claude Code structure
mkdir my-advanced-claude-project
cd my-advanced-claude-project

# Initialize git repository
git init

# Create Claude Code configuration directories
mkdir -p .claude/{agents,hooks}

# Create additional directories for advanced patterns
mkdir -p {src,tests,scripts,docs}
```

### 2. Clone Advanced Patterns Repository

```bash
# Clone the documentation studio repository
git clone https://github.com/anthropic/claude-code-documentation-studio.git
cd claude-code-documentation-studio

# Copy example configurations to your project
cp -r phase-2-implementation/.claude/* /path/to/your/project/.claude/
```

### 3. Install Dependencies

For JavaScript/TypeScript projects:
```bash
# Initialize package.json if not exists
npm init -y

# Install essential dependencies for advanced patterns
npm install --save-dev \
  prettier \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin

# Install runtime dependencies
npm install \
  chalk \
  inquirer \
  fs-extra
```

For Python projects:
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install essential dependencies
pip install \
  black \
  pylint \
  requests \
  pyyaml \
  jinja2
```

## Claude Code Configuration

### 1. Verify Claude Code Installation

```bash
# Check Claude Code version
claude --version

# Verify API connectivity
claude auth status

# Test basic functionality
claude "Hello, Claude Code!"
```

### 2. Configure Advanced Settings

Create or update your Claude Code settings:

```json
# ~/.claude/settings.json or .claude/settings.json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "temperature": 0.1,
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "Notification": [],
    "Stop": []
  }
}
```

## Subagent Setup

### 1. Install Example Subagents

Copy the example subagents from this repository:

```bash
# Copy advanced subagents
cp examples/subagents/* .claude/agents/

# Verify subagents are detected
claude /agents
```

### 2. Test Subagent Functionality

```bash
# Test a simple subagent invocation
claude "Use the code-reviewer subagent to analyze the current directory"
```

## Hooks Setup

### 1. Install Example Hooks

```bash
# Copy advanced hooks
cp examples/hooks/* .claude/hooks/

# Make hooks executable
chmod +x .claude/hooks/*.py
chmod +x .claude/hooks/*.sh
```

### 2. Configure Hook Settings

Update your settings.json with hook configurations:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/security_validator.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/format_on_edit.py"
          }
        ]
      }
    ]
  }
}
```

### 3. Test Hook Functionality

```bash
# Test hooks by creating a file
claude "Create a simple Python function in test.py"

# Verify hooks executed (check logs)
tail -f ~/.claude/hook-execution.log
```

## Development Tools Setup

### 1. IDE Integration

#### VS Code Extensions
```bash
# Install recommended extensions
code --install-extension ms-python.python
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
```

#### JetBrains IDEs
Configure Claude Code integration in your IDE settings.

### 2. Shell Integration

Add Claude Code helpers to your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
export CLAUDE_PROJECT_DIR="$(pwd)"
export CLAUDE_AUTO_HOOK_LOGGING=true

# Alias for common operations
alias cc="claude"
alias cca="claude /agents"
alias cch="claude /hooks"
```

## Verification Checklist

Verify your setup is working correctly:

- [ ] Claude Code responds to basic commands
- [ ] Subagents are listed in `/agents` command
- [ ] Hooks execute when configured events occur
- [ ] Development tools integrate properly
- [ ] Security validation hooks prevent dangerous operations
- [ ] Code formatting hooks work on file edits

## Troubleshooting

### Common Issues

**Claude Code not found**
```bash
# Verify installation
which claude
echo $PATH
```

**Hooks not executing**
```bash
# Check hook permissions
ls -la .claude/hooks/
chmod +x .claude/hooks/*
```

**Subagents not found**
```bash
# Verify subagent files
ls -la .claude/agents/
# Check file format (YAML frontmatter + markdown)
```

**Permission errors**
```bash
# Fix directory permissions
chmod -R 755 .claude/
```

### Getting Help

- 📖 Review the documentation sections for specific guidance
- 🐛 Check [GitHub Issues](https://github.com/anthropic/claude-code-documentation-studio/issues)
- 💬 Join the Claude Code community discussions

---

Ready to start implementing advanced patterns? Continue with [Quick Start](/docs/getting-started/quick-start).