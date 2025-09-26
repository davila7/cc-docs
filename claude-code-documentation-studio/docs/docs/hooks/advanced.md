---
sidebar_position: 2
---

# Advanced Hook Patterns

> Implement sophisticated event-driven automation and policy enforcement through advanced Claude Code hook patterns.

Advanced hook patterns enable enterprise developers to create sophisticated automation workflows that respond to development events with intelligent actions. These patterns extend beyond basic event handling to implement complex policy enforcement, multi-stage workflows, and enterprise integration.

## Enterprise Automation Patterns

### Multi-Stage Hook Workflows

Create complex automation pipelines that chain multiple hooks using JSON output control:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/security-pipeline.py"
          }
        ]
      }
    ]
  }
}
```

```python
#!/usr/bin/env python3
# security-pipeline.py
import json
import subprocess
import sys

# Load hook input
input_data = json.load(sys.stdin)
file_path = input_data.get("tool_input", {}).get("file_path", "")

# Multi-stage security validation
stages = [
    ("Static Analysis", ["bandit", "-f", "json", file_path]),
    ("Secret Detection", ["detect-secrets", "scan", file_path]),
    ("License Check", ["license-checker", file_path])
]

issues = []
for stage_name, command in stages:
    try:
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            issues.append(f"{stage_name}: {result.stderr}")
    except FileNotFoundError:
        issues.append(f"{stage_name}: Tool not found")

if issues:
    output = {
        "decision": "block",
        "reason": f"Security validation failed:\n" + "\n".join(issues),
        "systemMessage": "Security policies require remediation before proceeding"
    }
    print(json.dumps(output))
else:
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": f"Security validation passed for {file_path}"
        }
    }
    print(json.dumps(output))

sys.exit(0)
```

### Policy Enforcement Hooks

Implement enterprise governance through automated policy enforcement using PreToolUse hooks:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/command-policy.py"
          }
        ]
      }
    ]
  }
}
```

```python
#!/usr/bin/env python3
# command-policy.py
import json
import re
import sys

input_data = json.load(sys.stdin)
command = input_data.get("tool_input", {}).get("command", "")

# Enterprise security policies
blocked_patterns = [
    (r"\brm\s+-rf\s+/", "Recursive deletion of root directories is prohibited"),
    (r"\bsudo\b", "Elevated privileges not allowed in automated contexts"),
    (r"\bcurl\s+.*\|\s*bash", "Piping remote content to shell is prohibited"),
    (r"\bchmod\s+777", "World-writable permissions are prohibited")
]

for pattern, message in blocked_patterns:
    if re.search(pattern, command):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": f"Security Policy Violation: {message}"
            },
            "systemMessage": "Command blocked by enterprise security policy"
        }
        print(json.dumps(output))
        sys.exit(0)

# Auto-approve safe commands
safe_patterns = [r"^(ls|pwd|echo|cat|head|tail|grep|find|which)(\s|$)"]
for pattern in safe_patterns:
    if re.search(pattern, command):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "allow",
                "permissionDecisionReason": "Safe command auto-approved"
            },
            "suppressOutput": True
        }
        print(json.dumps(output))
        sys.exit(0)

# Ask for confirmation on other commands
output = {
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": f"Please confirm execution of: {command}"
    }
}
print(json.dumps(output))
sys.exit(0)
```

### Performance Monitoring Hooks

Implement real-time performance monitoring using multiple hook events:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/performance-monitor.py start"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/performance-monitor.py end",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

```python
#!/usr/bin/env python3
# performance-monitor.py
import json
import sys
import time
import psutil
import os

def get_system_metrics():
    return {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_io": psutil.disk_io_counters()._asdict() if psutil.disk_io_counters() else {},
        "timestamp": time.time()
    }

input_data = json.load(sys.stdin)
action = sys.argv[1] if len(sys.argv) > 1 else "start"

metrics_file = "/tmp/claude_performance_metrics.json"

if action == "start":
    metrics = get_system_metrics()
    with open(metrics_file, "w") as f:
        json.dump(metrics, f)
    sys.exit(0)

elif action == "end":
    if not os.path.exists(metrics_file):
        sys.exit(0)

    with open(metrics_file, "r") as f:
        start_metrics = json.load(f)

    end_metrics = get_system_metrics()
    duration = end_metrics["timestamp"] - start_metrics["timestamp"]

    # Check for performance issues
    cpu_increase = end_metrics["cpu_percent"] - start_metrics["cpu_percent"]
    memory_increase = end_metrics["memory_percent"] - start_metrics["memory_percent"]

    issues = []
    if duration > 30:
        issues.append(f"Command took {duration:.2f}s (>30s threshold)")
    if cpu_increase > 50:
        issues.append(f"High CPU usage increase: {cpu_increase:.1f}%")
    if memory_increase > 20:
        issues.append(f"High memory usage increase: {memory_increase:.1f}%")

    if issues:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": f"Performance Alert: {'; '.join(issues)}"
            },
            "systemMessage": "Performance thresholds exceeded - consider optimization"
        }
        print(json.dumps(output))

    os.unlink(metrics_file)
    sys.exit(0)
```

## Advanced Integration Patterns

### External System Integration

Connect hooks with enterprise systems using webhook notifications and API calls:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/enterprise-integration.py session_start"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/enterprise-integration.py session_end"
          }
        ]
      }
    ]
  }
}
```

```python
#!/usr/bin/env python3
# enterprise-integration.py
import json
import sys
import requests
import os
from datetime import datetime

def send_slack_notification(message, channel="#ai-development"):
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return

    payload = {
        "channel": channel,
        "text": message,
        "username": "Claude Code Bot",
        "icon_emoji": ":robot_face:"
    }

    try:
        requests.post(webhook_url, json=payload, timeout=10)
    except requests.RequestException:
        pass  # Silent failure for notifications

def log_to_enterprise_system(event_type, data):
    api_endpoint = os.getenv("ENTERPRISE_API_ENDPOINT")
    api_key = os.getenv("ENTERPRISE_API_KEY")

    if not api_endpoint or not api_key:
        return

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "event_type": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

    try:
        requests.post(api_endpoint, json=payload, headers=headers, timeout=30)
    except requests.RequestException:
        pass  # Silent failure for logging

input_data = json.load(sys.stdin)
action = sys.argv[1] if len(sys.argv) > 1 else ""

if action == "session_start":
    session_id = input_data.get("session_id", "unknown")
    user = os.getenv("USER", "unknown")
    project_dir = os.getenv("CLAUDE_PROJECT_DIR", "unknown")

    message = f"🚀 Claude Code session started by {user} in {os.path.basename(project_dir)}"
    send_slack_notification(message)

    log_to_enterprise_system("session_start", {
        "session_id": session_id,
        "user": user,
        "project": project_dir
    })

    # Add context for Claude
    context = f"Enterprise Development Session\nUser: {user}\nProject: {os.path.basename(project_dir)}\nSession ID: {session_id}\nStart Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    output = {
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": context
        }
    }
    print(json.dumps(output))

elif action == "session_end":
    session_id = input_data.get("session_id", "unknown")
    reason = input_data.get("reason", "unknown")
    user = os.getenv("USER", "unknown")

    message = f"⏹️ Claude Code session ended by {user} (reason: {reason})"
    send_slack_notification(message)

    log_to_enterprise_system("session_end", {
        "session_id": session_id,
        "user": user,
        "reason": reason
    })

sys.exit(0)
```

### MCP Tool Integration

Implement sophisticated patterns for Model Context Protocol tools:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/mcp-policy.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/mcp-audit.py"
          }
        ]
      }
    ]
  }
}
```

```python
#!/usr/bin/env python3
# mcp-policy.py
import json
import sys
import re

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Parse MCP tool name
mcp_match = re.match(r"mcp__(\w+)__(\w+)", tool_name)
if not mcp_match:
    sys.exit(0)

server_name, operation = mcp_match.groups()

# Server-specific policies
policies = {
    "filesystem": {
        "allowed_operations": ["read_file", "list_directory"],
        "blocked_paths": ["/etc", "/var", "/usr/bin"],
        "auto_approve": ["read_file"]
    },
    "memory": {
        "allowed_operations": ["create_entities", "search", "read"],
        "blocked_operations": ["delete_all"],
        "auto_approve": ["search", "read"]
    },
    "github": {
        "allowed_operations": ["search_repositories", "get_repository", "list_issues"],
        "blocked_operations": ["delete_repository", "create_repository"],
        "auto_approve": ["search_repositories"]
    }
}

server_policy = policies.get(server_name, {})

# Check blocked operations
if operation in server_policy.get("blocked_operations", []):
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": f"Operation {operation} is blocked for {server_name} server"
        }
    }
    print(json.dumps(output))
    sys.exit(0)

# Check filesystem path restrictions
if server_name == "filesystem" and operation in ["read_file", "write_file"]:
    file_path = tool_input.get("path", "")
    for blocked_path in server_policy.get("blocked_paths", []):
        if file_path.startswith(blocked_path):
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"Access to {blocked_path} is restricted"
                }
            }
            print(json.dumps(output))
            sys.exit(0)

# Auto-approve safe operations
if operation in server_policy.get("auto_approve", []):
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
            "permissionDecisionReason": f"Safe {server_name} operation auto-approved"
        },
        "suppressOutput": True
    }
    print(json.dumps(output))
    sys.exit(0)

# Ask for confirmation on other operations
output = {
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": f"Confirm {operation} on {server_name} server"
    }
}
print(json.dumps(output))
sys.exit(0)
```

## Advanced Hook Orchestration

### Conditional Hook Execution

Implement sophisticated conditional logic based on project context and file types:

```python
#!/usr/bin/env python3
# conditional-formatter.py
import json
import sys
import os
import subprocess
from pathlib import Path

input_data = json.load(sys.stdin)
file_path = input_data.get("tool_input", {}).get("file_path", "")

if not file_path:
    sys.exit(0)

file_ext = Path(file_path).suffix
project_root = os.getenv("CLAUDE_PROJECT_DIR", "")

# Detect project type and configuration
def detect_project_config():
    config_files = {
        "package.json": "nodejs",
        "pyproject.toml": "python",
        "Cargo.toml": "rust",
        "go.mod": "go",
        "composer.json": "php"
    }

    for config_file, project_type in config_files.items():
        if os.path.exists(os.path.join(project_root, config_file)):
            return project_type
    return "generic"

project_type = detect_project_config()

# Format based on file type and project configuration
formatters = {
    "nodejs": {
        ".js": ["prettier", "--write"],
        ".ts": ["prettier", "--write"],
        ".jsx": ["prettier", "--write"],
        ".tsx": ["prettier", "--write"],
        ".json": ["prettier", "--write"]
    },
    "python": {
        ".py": ["black", "--quiet"],
        ".pyi": ["black", "--quiet"]
    },
    "rust": {
        ".rs": ["rustfmt"]
    },
    "go": {
        ".go": ["gofmt", "-w"]
    }
}

project_formatters = formatters.get(project_type, {})
formatter_cmd = project_formatters.get(file_ext)

if formatter_cmd:
    try:
        cmd = formatter_cmd + [file_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        if result.returncode == 0:
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": f"Formatted {file_path} using {formatter_cmd[0]}"
                },
                "suppressOutput": True
            }
            print(json.dumps(output))
        else:
            output = {
                "systemMessage": f"Formatting failed for {file_path}: {result.stderr}"
            }
            print(json.dumps(output))

    except (subprocess.TimeoutExpired, FileNotFoundError):
        output = {
            "systemMessage": f"Formatter {formatter_cmd[0]} not available or timed out"
        }
        print(json.dumps(output))

sys.exit(0)
```

### Failure Recovery and Rollback

Implement sophisticated error handling and recovery mechanisms:

```python
#!/usr/bin/env python3
# resilient-deployment.py
import json
import sys
import subprocess
import time
import os

input_data = json.load(sys.stdin)
tool_input = input_data.get("tool_input", {})
command = tool_input.get("command", "")

# Detect deployment commands
deployment_patterns = ["docker deploy", "kubectl apply", "helm install", "terraform apply"]
is_deployment = any(pattern in command for pattern in deployment_patterns)

if not is_deployment:
    sys.exit(0)

# Create deployment checkpoint
checkpoint_file = f"/tmp/claude_deployment_{int(time.time())}.json"
checkpoint_data = {
    "timestamp": time.time(),
    "command": command,
    "project_dir": os.getenv("CLAUDE_PROJECT_DIR"),
    "user": os.getenv("USER")
}

with open(checkpoint_file, "w") as f:
    json.dump(checkpoint_data, f)

# Monitor deployment health
def check_deployment_health():
    health_checks = [
        ["curl", "-f", "http://localhost:8080/health"],
        ["kubectl", "get", "pods", "--field-selector=status.phase!=Running"],
        ["docker", "ps", "--filter", "health=unhealthy"]
    ]

    for check in health_checks:
        try:
            result = subprocess.run(check, capture_output=True, timeout=10)
            if result.returncode != 0:
                return False, f"Health check failed: {' '.join(check)}"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue

    return True, "All health checks passed"

# Pre-deployment validation
output = {
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": f"Deployment command detected. Checkpoint created at {checkpoint_file}. Proceed with deployment?"
    },
    "systemMessage": "Deployment checkpoint created for rollback capability"
}

print(json.dumps(output))
sys.exit(0)
```

## Enterprise Hook Management

### Hook Governance Framework

Implement enterprise-grade hook governance with approval workflows:

```python
#!/usr/bin/env python3
# governance-hook.py
import json
import sys
import os
import hashlib
import requests
from datetime import datetime

input_data = json.load(sys.stdin)
tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Calculate command hash for approval tracking
command_hash = hashlib.sha256(str(tool_input).encode()).hexdigest()[:16]

# Governance policies
governance_config = {
    "approval_required": {
        "tools": ["Bash", "Write", "Edit"],
        "patterns": [r"sudo", r"rm -rf", r"chmod 777", r"curl.*\|.*bash"],
        "approvers": ["tech-lead", "security-team"]
    },
    "audit_required": {
        "tools": ["mcp__.*", "WebFetch", "WebSearch"],
        "retention_days": 90
    }
}

def requires_approval(tool_name, tool_input):
    if tool_name in governance_config["approval_required"]["tools"]:
        return True

    command = tool_input.get("command", "")
    for pattern in governance_config["approval_required"]["patterns"]:
        if re.search(pattern, command):
            return True

    return False

def log_audit_trail(event_type, data):
    audit_log = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user": os.getenv("USER"),
        "session_id": input_data.get("session_id"),
        "command_hash": command_hash,
        "data": data
    }

    # Log to enterprise audit system
    audit_endpoint = os.getenv("AUDIT_ENDPOINT")
    if audit_endpoint:
        try:
            requests.post(audit_endpoint, json=audit_log, timeout=10)
        except requests.RequestException:
            pass

# Check if approval is required
if requires_approval(tool_name, tool_input):
    # Log approval request
    log_audit_trail("approval_requested", {
        "tool_name": tool_name,
        "tool_input": tool_input
    })

    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": f"Enterprise governance requires approval for this operation (ID: {command_hash})"
        },
        "systemMessage": "Operation logged for governance compliance"
    }
    print(json.dumps(output))
else:
    # Auto-approve with audit logging
    log_audit_trail("auto_approved", {
        "tool_name": tool_name,
        "tool_input": tool_input
    })

    output = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
            "permissionDecisionReason": "Auto-approved with audit logging"
        },
        "suppressOutput": True
    }
    print(json.dumps(output))

sys.exit(0)
```

## Best Practices for Advanced Hooks

### Security Considerations

1. **Input Validation**: Always validate and sanitize hook inputs
2. **Privilege Limitation**: Run hooks with minimal required privileges
3. **Secret Management**: Use environment variables for sensitive data
4. **Audit Logging**: Implement comprehensive audit trails
5. **Error Handling**: Graceful failure handling without exposing sensitive information

### Performance Optimization

1. **Timeout Management**: Set appropriate timeouts for all hook operations
2. **Parallel Execution**: Design hooks for concurrent execution where possible
3. **Resource Monitoring**: Track hook resource consumption
4. **Caching**: Implement intelligent caching for repeated operations
5. **Lazy Loading**: Load resources only when needed

### Enterprise Integration

1. **API Integration**: Connect with enterprise systems through REST APIs
2. **Message Queues**: Use enterprise message queues for reliable communication
3. **Monitoring**: Integrate with enterprise monitoring and alerting systems
4. **Compliance**: Ensure all hooks meet regulatory compliance requirements
5. **Documentation**: Maintain comprehensive documentation for all custom hooks

Advanced hook patterns enable sophisticated automation and policy enforcement that scales with enterprise requirements while maintaining security, compliance, and performance standards.