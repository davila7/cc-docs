---
sidebar_position: 3
---

# Quick Start

Get up and running with advanced Claude Code patterns in under 10 minutes. This guide demonstrates the core concepts with practical examples you can implement immediately.

## 5-Minute Setup

### 1. Create Your First Advanced Subagent

Create a specialized code review subagent:

```bash
# Create the subagent file
mkdir -p .claude/agents
cat > .claude/agents/security-reviewer.md << 'EOF'
---
name: security-reviewer
description: Security-focused code reviewer. Use proactively when security analysis is needed.
tools: Read, Grep, Bash
---

You are a senior security engineer specializing in code security analysis.

When invoked:
1. Analyze code for security vulnerabilities
2. Check for exposed secrets and credentials
3. Review authentication and authorization
4. Provide specific remediation steps

Security focus areas:
- SQL injection and XSS vulnerabilities
- Authentication bypass possibilities
- Data exposure risks
- Insecure dependencies
EOF
```

### 2. Test Your Subagent

```bash
# Invoke your new subagent
claude "Use the security-reviewer subagent to analyze my authentication code"
```

### 3. Create Your First Advanced Hook

Create an automatic security validation hook:

```bash
# Create the hook script
cat > .claude/hooks/quick_security_check.py << 'EOF'
#!/usr/bin/env python3
"""
Quick security validation hook
"""
import json
import sys
import re

def check_security_issues(content):
    issues = []

    # Check for potential secrets
    secret_patterns = [
        r'password\s*=\s*["\'][^"\']+["\']',
        r'api_key\s*=\s*["\'][^"\']+["\']',
        r'secret\s*=\s*["\'][^"\']+["\']'
    ]

    for pattern in secret_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append(f"Potential secret detected: {pattern}")

    return issues

# Main execution
try:
    input_data = json.load(sys.stdin)
    tool_input = input_data.get('tool_input', {})

    # Check content for security issues
    content = tool_input.get('content', '') or tool_input.get('new_string', '')

    if content:
        issues = check_security_issues(content)
        if issues:
            print("🔒 Security Review:")
            for issue in issues:
                print(f"  ⚠️ {issue}")
            print("Consider using environment variables for sensitive data.")
        else:
            print("✅ Quick security check passed")

except Exception as e:
    print(f"Hook error: {e}", file=sys.stderr)

sys.exit(0)  # Always allow operation to continue
EOF

# Make hook executable
chmod +x .claude/hooks/quick_security_check.py
```

### 4. Configure the Hook

Add the hook to your Claude Code settings:

```bash
# Update .claude/settings.json
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/quick_security_check.py"
          }
        ]
      }
    ]
  }
}
EOF
```

### 5. Test the Complete Setup

```bash
# Test the hook by creating a file with potential security issues
claude "Create a Python file with a simple login function that includes a hardcoded password"

# The hook should automatically detect and warn about the hardcoded password
```

## 10-Minute Advanced Workflow

### 1. Create a Workflow Orchestrator

```bash
cat > .claude/agents/workflow-coordinator.md << 'EOF'
---
name: workflow-coordinator
description: Coordinates complex multi-step development workflows. Use for orchestrating multiple subagents and processes.
tools: Task, Read, Write, Bash
---

You are a workflow orchestration expert managing complex development processes.

Workflow coordination approach:
1. **Analysis Phase**
   - Break down complex tasks into logical steps
   - Identify appropriate subagents for each step
   - Plan execution sequence and dependencies

2. **Execution Phase**
   - Use Task tool to invoke appropriate subagents
   - Monitor execution and handle errors
   - Coordinate data flow between steps

3. **Validation Phase**
   - Verify each step completed successfully
   - Run quality checks and validations
   - Report overall workflow status

Always provide clear progress updates and handle failures gracefully.
EOF
```

### 2. Create a Complete CI/CD Hook Chain

```bash
# Create a comprehensive formatting hook
cat > .claude/hooks/ci_pipeline.py << 'EOF'
#!/usr/bin/env python3
"""
CI/CD Pipeline Hook - Runs multiple validation steps
"""
import json
import sys
import subprocess
from pathlib import Path

def run_linting(file_path):
    """Run appropriate linter based on file extension"""
    path = Path(file_path)

    try:
        if path.suffix == '.py':
            result = subprocess.run(['python', '-m', 'py_compile', file_path],
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Python syntax check passed: {file_path}")
            else:
                print(f"❌ Python syntax error in {file_path}: {result.stderr}")

        elif path.suffix in ['.js', '.ts']:
            # Check if eslint is available
            try:
                result = subprocess.run(['npx', 'eslint', file_path],
                                      capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    print(f"✅ JavaScript/TypeScript lint passed: {file_path}")
                else:
                    print(f"⚠️ Linting issues in {file_path}:")
                    print(result.stdout)
            except FileNotFoundError:
                print(f"ℹ️ ESLint not found, skipping lint for {file_path}")

    except Exception as e:
        print(f"⚠️ Linting error for {file_path}: {e}")

def format_file(file_path):
    """Format file based on extension"""
    path = Path(file_path)

    try:
        if path.suffix == '.py':
            # Simple Python formatting check
            with open(file_path, 'r') as f:
                content = f.read()
            if '\t' in content and '    ' in content:
                print(f"⚠️ Mixed tabs and spaces in {file_path}")

        elif path.suffix in ['.js', '.ts', '.json']:
            try:
                subprocess.run(['npx', 'prettier', '--check', file_path],
                             capture_output=True, timeout=10)
                print(f"✅ Code formatting check passed: {file_path}")
            except FileNotFoundError:
                print(f"ℹ️ Prettier not found, skipping format check for {file_path}")

    except Exception as e:
        print(f"⚠️ Formatting error for {file_path}: {e}")

# Main execution
try:
    input_data = json.load(sys.stdin)
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path')

    if file_path and Path(file_path).exists():
        print(f"🔄 Running CI/CD checks for {file_path}")
        run_linting(file_path)
        format_file(file_path)
        print(f"✅ CI/CD checks completed for {file_path}")

except Exception as e:
    print(f"CI/CD hook error: {e}", file=sys.stderr)

sys.exit(0)
EOF

chmod +x .claude/hooks/ci_pipeline.py
```

### 3. Update Settings for Advanced Hooks

```bash
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"🔍 Pre-edit validation starting...\" >> ~/.claude/workflow.log"
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
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/quick_security_check.py"
          },
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/ci_pipeline.py"
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
            "command": "echo \"✅ Workflow completed at $(date)\" >> ~/.claude/workflow.log"
          }
        ]
      }
    ]
  }
}
EOF
```

### 4. Test the Advanced Workflow

```bash
# Test the complete workflow with a complex task
claude "Use the workflow-coordinator subagent to help me create a secure authentication system for a web application. Include proper error handling and logging."

# Monitor the workflow
tail -f ~/.claude/workflow.log
```

## Common Patterns You'll Use

### Pattern 1: Security-First Development

Every file edit triggers:
1. Security validation hook
2. Code quality checks
3. Automated formatting
4. Compliance logging

### Pattern 2: Multi-Subagent Orchestration

Complex tasks automatically:
1. Route to appropriate specialist subagents
2. Coordinate between subagents
3. Aggregate results
4. Provide comprehensive feedback

### Pattern 3: Continuous Integration

Development workflow includes:
1. Pre-edit validation
2. Security scanning
3. Code quality checks
4. Automated formatting
5. Completion logging

## Verification

Test that your quick start setup is working:

```bash
# 1. Verify subagents are available
claude /agents

# 2. Create a test file to trigger hooks
claude "Create a simple Node.js server file with basic authentication"

# 3. Check workflow logs
cat ~/.claude/workflow.log

# 4. Test workflow orchestration
claude "Use the workflow-coordinator to help me implement a complete user registration system"
```

## Next Steps

Now that you have the basics working:

1. 📖 **Learn More**: Explore [Subagents Overview](/docs/subagents/overview) for advanced patterns
2. 🪝 **Advanced Hooks**: Check out [Hooks Overview](/docs/hooks/overview) for complex automation
3. 🔄 **Workflow Patterns**: See [Workflows Overview](/docs/workflows/overview) for orchestration
4. 🔒 **Security**: Review [Security Patterns](/docs/security/validation-patterns) for enterprise use

## Troubleshooting

**Subagents not found?**
- Check file format: YAML frontmatter + markdown content
- Verify file location: `.claude/agents/`

**Hooks not executing?**
- Check permissions: `chmod +x .claude/hooks/*.py`
- Verify JSON syntax in settings.json

**Workflow coordinator not responding?**
- Ensure Task tool access in subagent configuration
- Check subagent description triggers workflow usage

---

🎉 **Congratulations!** You now have a working advanced Claude Code setup. Start building sophisticated AI-assisted development workflows!