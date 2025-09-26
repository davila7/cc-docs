---
sidebar_position: 1
---

# Hooks Overview

Advanced Claude Code hooks provide deterministic automation and policy enforcement throughout the development workflow. Unlike relying on the LLM to choose appropriate actions, hooks ensure critical operations always execute consistently and reliably.

## What are Advanced Hooks?

Hooks are event-driven shell commands or scripts that execute at specific points in Claude Code's lifecycle. They transform suggestions into app-level automation that runs every time specific events occur.

### Key Characteristics

- **Deterministic execution** - Always run when triggered, not dependent on LLM decisions
- **Event-driven** - Respond to specific Claude Code lifecycle events
- **Policy enforcement** - Implement organizational standards and security requirements
- **Integration-ready** - Connect with external systems and workflows

## Hook Event Types

### PreToolUse Hooks
Execute before Claude Code runs any tool, with the ability to block operations:

```python
#!/usr/bin/env python3
"""
Security validation hook - blocks dangerous operations
"""
import json
import sys

def validate_security(tool_input):
    # Check for dangerous patterns
    violations = []

    if tool_input.get('command', '').startswith('rm -rf /'):
        violations.append("Dangerous deletion command detected")

    if violations:
        print("🚨 Security violations:", violations)
        sys.exit(2)  # Block the operation

# Main execution
input_data = json.load(sys.stdin)
validate_security(input_data.get('tool_input', {}))
```

**Use cases:**
- Security policy enforcement
- Resource access validation
- Cost control mechanisms
- Compliance checking

### PostToolUse Hooks
Execute after tool operations complete, for automation and reporting:

```python
#!/usr/bin/env python3
"""
Code formatting hook - automatically formats code after edits
"""
import json
import sys
import subprocess
from pathlib import Path

def format_code_file(file_path):
    path = Path(file_path)

    # Format based on file extension
    if path.suffix == '.py':
        subprocess.run(['black', file_path])
    elif path.suffix in ['.ts', '.tsx', '.js', '.jsx']:
        subprocess.run(['prettier', '--write', file_path])
    elif path.suffix == '.go':
        subprocess.run(['gofmt', '-w', file_path])

# Main execution
input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})

if file_path := tool_input.get('file_path'):
    format_code_file(file_path)
    print(f"✅ Formatted {file_path}")
```

**Use cases:**
- Automatic code formatting
- Test execution triggers
- Deployment notifications
- Quality metric collection

### Notification Hooks
Execute when Claude Code needs to notify the user:

```bash
#!/bin/bash
# Desktop notification hook
notify-send "Claude Code" "Awaiting your input" --icon=dialog-information

# Also log to file for audit trail
echo "$(date): Claude Code notification sent" >> ~/.claude/notifications.log
```

**Use cases:**
- Custom notification systems
- Integration with communication platforms
- Escalation procedures
- Activity logging

### Workflow Lifecycle Hooks
Execute at key workflow moments:

```python
#!/usr/bin/env python3
"""
Session tracking hook - monitors Claude Code usage
"""
import json
import sys
from datetime import datetime

def track_session_event(event_type, data):
    session_log = {
        'timestamp': datetime.now().isoformat(),
        'event': event_type,
        'data': data,
        'user': os.environ.get('USER'),
        'project': os.environ.get('CLAUDE_PROJECT_DIR', '').split('/')[-1]
    }

    # Send to monitoring system
    send_to_metrics_system(session_log)

    # Local logging
    with open('~/.claude/session.log', 'a') as f:
        f.write(json.dumps(session_log) + '\n')

# Handle different lifecycle events
event_type = sys.argv[1] if len(sys.argv) > 1 else 'unknown'
input_data = json.load(sys.stdin) if not sys.stdin.isatty() else {}

track_session_event(event_type, input_data)
```

## Advanced Hook Patterns

### Hook Chaining
Multiple hooks can be chained for complex workflows:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/security_validator.py"
          },
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/backup_file.py"
          },
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/validate_permissions.py"
          }
        ]
      }
    ]
  }
}
```

### Conditional Execution
Hooks can implement complex conditional logic:

```python
#!/usr/bin/env python3
"""
Conditional formatting hook
"""
import json
import sys
import os
from pathlib import Path

def should_format_file(file_path, project_config):
    path = Path(file_path)

    # Check project-specific formatting rules
    if project_config.get('auto_format') == False:
        return False

    # Skip certain directories
    skip_dirs = project_config.get('skip_format_dirs', [])
    if any(skip_dir in path.parts for skip_dir in skip_dirs):
        return False

    # Only format certain file types
    allowed_extensions = project_config.get('format_extensions', ['.py', '.ts', '.js'])
    if path.suffix not in allowed_extensions:
        return False

    return True

def load_project_config():
    config_path = Path(os.environ.get('CLAUDE_PROJECT_DIR', '.')) / '.claude' / 'format-config.json'
    if config_path.exists():
        with open(config_path) as f:
            return json.load(f)
    return {}

# Main execution
input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path')

if file_path:
    project_config = load_project_config()
    if should_format_file(file_path, project_config):
        format_file(file_path)
        print(f"✅ Formatted {file_path}")
    else:
        print(f"⏭️ Skipped formatting {file_path}")
```

### External System Integration
Hooks can integrate with external systems and APIs:

```python
#!/usr/bin/env python3
"""
JIRA integration hook - creates tickets for TODOs
"""
import json
import sys
import re
import requests
from datetime import datetime

class JIRAIntegration:
    def __init__(self, config):
        self.base_url = config['jira_url']
        self.auth = (config['username'], config['api_token'])
        self.project_key = config['project_key']

    def create_todo_ticket(self, todo_text, file_path, line_number):
        ticket_data = {
            "fields": {
                "project": {"key": self.project_key},
                "summary": f"TODO: {todo_text[:50]}...",
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [{
                        "type": "paragraph",
                        "content": [{
                            "type": "text",
                            "text": f"TODO found in {file_path}:{line_number}\n\n{todo_text}"
                        }]
                    }]
                },
                "issuetype": {"name": "Task"},
                "labels": ["claude-code-todo", "technical-debt"]
            }
        }

        response = requests.post(
            f"{self.base_url}/rest/api/3/issue",
            json=ticket_data,
            auth=self.auth
        )

        if response.status_code == 201:
            ticket = response.json()
            print(f"📋 Created JIRA ticket: {ticket['key']}")
            return ticket['key']
        else:
            print(f"❌ Failed to create JIRA ticket: {response.text}")
            return None

def extract_todos_from_content(content, file_path):
    todos = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Match TODO, FIXME, HACK comments
        todo_match = re.search(r'(TODO|FIXME|HACK):?\s*(.+)', line, re.IGNORECASE)
        if todo_match:
            todos.append({
                'type': todo_match.group(1).upper(),
                'text': todo_match.group(2).strip(),
                'file': file_path,
                'line': i
            })

    return todos

# Main execution
input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})

# Only process file writes/edits
if 'content' in tool_input or 'new_string' in tool_input:
    content = tool_input.get('content', '') or tool_input.get('new_string', '')
    file_path = tool_input.get('file_path', '')

    todos = extract_todos_from_content(content, file_path)

    if todos:
        config = load_jira_config()
        jira = JIRAIntegration(config)

        for todo in todos:
            jira.create_todo_ticket(todo['text'], todo['file'], todo['line'])
```

## Security Considerations

### Input Validation
Always validate hook inputs to prevent security vulnerabilities:

```python
def validate_hook_input(input_data):
    """Validate and sanitize hook input data"""

    # Check for required fields
    if 'tool_input' not in input_data:
        raise ValueError("Missing tool_input in hook data")

    tool_input = input_data['tool_input']

    # Sanitize file paths
    if 'file_path' in tool_input:
        file_path = Path(tool_input['file_path']).resolve()

        # Ensure path is within project directory
        project_dir = Path(os.environ.get('CLAUDE_PROJECT_DIR', '.')).resolve()
        if not str(file_path).startswith(str(project_dir)):
            raise SecurityError("File path outside project directory")

    # Sanitize command inputs
    if 'command' in tool_input:
        command = tool_input['command']

        # Block dangerous command patterns
        dangerous_patterns = [
            r'rm\s+-rf\s+/',
            r'sudo\s+rm',
            r'>\s*/etc/',
            r'curl.*\|\s*sh'
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, command):
                raise SecurityError(f"Dangerous command pattern detected: {pattern}")

    return tool_input
```

### Access Control
Implement proper access controls in hooks:

```python
def check_permissions(operation, resource):
    """Check if current user has permission for operation on resource"""

    user = os.environ.get('USER')
    project = os.environ.get('CLAUDE_PROJECT_DIR', '').split('/')[-1]

    # Load permission matrix
    permissions = load_permission_config()

    user_permissions = permissions.get('users', {}).get(user, [])
    project_permissions = permissions.get('projects', {}).get(project, [])

    required_permission = f"{operation}:{resource}"

    if required_permission not in user_permissions and required_permission not in project_permissions:
        raise PermissionError(f"User {user} lacks permission: {required_permission}")

    return True
```

### Audit Logging
Comprehensive audit logging for security and compliance:

```python
def audit_log(event_type, details):
    """Create detailed audit log entry"""

    audit_entry = {
        'timestamp': datetime.now().isoformat(),
        'event_type': event_type,
        'user': os.environ.get('USER'),
        'session_id': os.environ.get('CLAUDE_SESSION_ID'),
        'project': os.environ.get('CLAUDE_PROJECT_DIR', '').split('/')[-1],
        'details': details,
        'ip_address': get_client_ip(),
        'user_agent': os.environ.get('CLAUDE_USER_AGENT')
    }

    # Write to secure audit log
    with open('/var/log/claude-code/audit.log', 'a') as f:
        f.write(json.dumps(audit_entry) + '\n')

    # Send to SIEM system
    send_to_siem(audit_entry)
```

---

Ready to implement advanced hooks? Continue with [Hook Types](/docs/hooks/hook-types) to explore specific hook implementations.