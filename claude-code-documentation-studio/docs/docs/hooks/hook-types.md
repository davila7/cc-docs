---
sidebar_position: 2
---

# Hook Types

Claude Code provides several hook events that trigger at different points in the workflow lifecycle. Understanding when and how to use each hook type is essential for building robust automation.

## PreToolUse Hooks

Execute **before** Claude Code runs any tool, with the ability to block operations.

### Event Data Structure

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.py",
    "old_string": "original code",
    "new_string": "modified code"
  },
  "context": {
    "user_request": "Fix the bug in the authentication function",
    "session_id": "session_123"
  }
}
```

### Use Cases

#### Security Validation
```python
#!/usr/bin/env python3
"""
Security validation PreToolUse hook
"""
import json
import sys
import re

def validate_security(tool_name, tool_input):
    violations = []

    # Block dangerous file operations
    if tool_name in ['Edit', 'Write', 'MultiEdit']:
        file_path = tool_input.get('file_path', '')

        # Prevent editing system files
        if file_path.startswith(('/etc/', '/usr/', '/bin/', '/sbin/')):
            violations.append(f"Blocked system file edit: {file_path}")

        # Check for hardcoded secrets
        content = tool_input.get('new_string', '') or tool_input.get('content', '')
        secret_patterns = [
            r'password\s*[=:]\s*["\'][^"\']{8,}["\']',
            r'api_key\s*[=:]\s*["\'][^"\']{20,}["\']',
            r'secret_key\s*[=:]\s*["\'][^"\']{16,}["\']'
        ]

        for pattern in secret_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                violations.append("Potential hardcoded secret detected")
                break

    # Block dangerous commands
    elif tool_name == 'Bash':
        command = tool_input.get('command', '')
        dangerous_commands = [
            r'rm\s+-rf\s+/',
            r'sudo\s+rm',
            r'chmod\s+777',
            r'>\s*/etc/',
            r'curl.*\|\s*(sh|bash)'
        ]

        for pattern in dangerous_commands:
            if re.search(pattern, command):
                violations.append(f"Dangerous command blocked: {pattern}")

    return violations

# Main execution
try:
    input_data = json.load(sys.stdin)
    tool_name = input_data.get('tool_name')
    tool_input = input_data.get('tool_input', {})

    violations = validate_security(tool_name, tool_input)

    if violations:
        print("🚨 Security Policy Violations:")
        for violation in violations:
            print(f"  ❌ {violation}")
        print("\nOperation blocked for security reasons.")
        sys.exit(2)  # Block the operation

    # Log approved operation
    print(f"✅ Security validation passed for {tool_name}")
    sys.exit(0)  # Allow operation

except Exception as e:
    print(f"Security hook error: {e}", file=sys.stderr)
    sys.exit(1)  # Error - block operation
```

#### Resource Quotas
```python
#!/usr/bin/env python3
"""
Resource quota enforcement PreToolUse hook
"""
import json
import sys
import os
from pathlib import Path

def check_resource_quotas(tool_name, tool_input):
    quotas = load_quotas()
    violations = []

    # File size limits
    if tool_name in ['Write', 'Edit']:
        file_path = tool_input.get('file_path', '')
        content = tool_input.get('content', '') or tool_input.get('new_string', '')

        if len(content) > quotas.get('max_file_size', 1000000):  # 1MB default
            violations.append(f"File exceeds size limit: {len(content)} bytes")

    # Disk space checks
    if tool_name == 'Write':
        file_path = tool_input.get('file_path', '')
        if file_path:
            free_space = get_free_disk_space(Path(file_path).parent)
            if free_space < quotas.get('min_free_space', 100 * 1024 * 1024):  # 100MB
                violations.append("Insufficient disk space")

    # API call limits
    user_id = os.environ.get('USER', 'unknown')
    daily_calls = get_daily_api_calls(user_id)
    if daily_calls >= quotas.get('max_daily_calls', 1000):
        violations.append("Daily API call limit exceeded")

    return violations

def load_quotas():
    """Load resource quotas from configuration"""
    quota_file = Path('.claude/quotas.json')
    if quota_file.exists():
        with open(quota_file) as f:
            return json.load(f)
    return {}

def get_free_disk_space(path):
    """Get available disk space in bytes"""
    statvfs = os.statvfs(path)
    return statvfs.f_frsize * statvfs.f_bavail

def get_daily_api_calls(user_id):
    """Get user's API calls today"""
    # Implementation would track calls in database/file
    return 0

# Main execution
input_data = json.load(sys.stdin)
violations = check_resource_quotas(
    input_data.get('tool_name'),
    input_data.get('tool_input', {})
)

if violations:
    print("🚫 Resource Quota Violations:")
    for violation in violations:
        print(f"  ⚠️ {violation}")
    sys.exit(2)

print("✅ Resource quota check passed")
sys.exit(0)
```

## PostToolUse Hooks

Execute **after** tool operations complete successfully.

### Event Data Structure

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.py",
    "old_string": "original code",
    "new_string": "modified code"
  },
  "tool_result": {
    "success": true,
    "message": "File updated successfully"
  },
  "execution_time_ms": 150
}
```

### Use Cases

#### Automatic Code Formatting
```python
#!/usr/bin/env python3
"""
Multi-language code formatter PostToolUse hook
"""
import json
import sys
import subprocess
from pathlib import Path

def format_code_file(file_path):
    """Format file based on extension"""
    path = Path(file_path)
    formatted = False

    try:
        if path.suffix == '.py':
            # Format Python with black
            result = subprocess.run(
                ['black', '--quiet', str(path)],
                capture_output=True,
                timeout=30
            )
            if result.returncode == 0:
                formatted = True
                print(f"🐍 Formatted Python: {path}")
            else:
                print(f"⚠️ Black formatting failed: {result.stderr}")

        elif path.suffix in ['.js', '.ts', '.jsx', '.tsx', '.json', '.css']:
            # Format with Prettier
            result = subprocess.run(
                ['npx', 'prettier', '--write', str(path)],
                capture_output=True,
                timeout=30
            )
            if result.returncode == 0:
                formatted = True
                print(f"💅 Formatted with Prettier: {path}")

        elif path.suffix == '.go':
            # Format Go code
            result = subprocess.run(
                ['gofmt', '-w', str(path)],
                capture_output=True,
                timeout=30
            )
            if result.returncode == 0:
                formatted = True
                print(f"🐹 Formatted Go: {path}")

        elif path.suffix in ['.rs']:
            # Format Rust code
            result = subprocess.run(
                ['rustfmt', str(path)],
                capture_output=True,
                timeout=30
            )
            if result.returncode == 0:
                formatted = True
                print(f"🦀 Formatted Rust: {path}")

    except subprocess.TimeoutExpired:
        print(f"⏱️ Formatting timeout for {path}")
    except FileNotFoundError as e:
        print(f"⚠️ Formatter not found: {e}")

    return formatted

# Main execution
try:
    input_data = json.load(sys.stdin)
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path')

    if file_path and Path(file_path).exists():
        format_code_file(file_path)

except Exception as e:
    print(f"Formatting hook error: {e}", file=sys.stderr)
```

#### Test Execution Trigger
```python
#!/usr/bin/env python3
"""
Automatic test execution PostToolUse hook
"""
import json
import sys
import subprocess
from pathlib import Path

def should_run_tests(file_path):
    """Determine if tests should run based on changed file"""
    path = Path(file_path)

    # Always run tests for test files
    if 'test' in path.name or path.name.startswith('test_'):
        return True

    # Run tests for source files in certain directories
    test_trigger_paths = ['src/', 'lib/', 'app/']
    return any(part in path.parts for part in test_trigger_paths)

def run_appropriate_tests(file_path):
    """Run tests appropriate for the changed file"""
    path = Path(file_path)
    tests_run = []

    try:
        if path.suffix == '.py':
            # Run Python tests
            test_file = find_related_test_file(path)
            if test_file and test_file.exists():
                result = subprocess.run(
                    ['python', '-m', 'pytest', str(test_file), '-v'],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    tests_run.append(f"✅ {test_file}")
                else:
                    tests_run.append(f"❌ {test_file}: {result.stdout}")

        elif path.suffix in ['.js', '.ts']:
            # Run JavaScript/TypeScript tests
            if Path('package.json').exists():
                result = subprocess.run(
                    ['npm', 'test', '--', '--testPathPattern', str(path.stem)],
                    capture_output=True,
                    text=True,
                    timeout=120
                )
                if result.returncode == 0:
                    tests_run.append("✅ JavaScript tests passed")
                else:
                    tests_run.append(f"❌ JavaScript tests failed: {result.stdout}")

    except subprocess.TimeoutExpired:
        tests_run.append("⏱️ Test execution timeout")
    except Exception as e:
        tests_run.append(f"⚠️ Test execution error: {e}")

    return tests_run

def find_related_test_file(source_file):
    """Find the test file for a source file"""
    source_path = Path(source_file)

    # Common test file patterns
    test_patterns = [
        source_path.parent / f"test_{source_path.stem}.py",
        source_path.parent / "tests" / f"test_{source_path.stem}.py",
        Path("tests") / f"test_{source_path.stem}.py",
    ]

    for pattern in test_patterns:
        if pattern.exists():
            return pattern

    return None

# Main execution
input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path')

if file_path and should_run_tests(file_path):
    print(f"🧪 Running tests for {file_path}")
    test_results = run_appropriate_tests(file_path)

    if test_results:
        print("Test Results:")
        for result in test_results:
            print(f"  {result}")
    else:
        print("  No tests found or executed")
```

## UserPromptSubmit Hooks

Execute when the user submits a prompt, before Claude processes it.

### Event Data Structure

```json
{
  "prompt": "Please review the security of my authentication code",
  "session_context": {
    "conversation_length": 15,
    "recent_files": ["/path/to/auth.py", "/path/to/config.py"],
    "active_subagents": ["security-reviewer"]
  }
}
```

### Use Cases

#### Context Enhancement
```python
#!/usr/bin/env python3
"""
Context enhancement UserPromptSubmit hook
"""
import json
import sys
import os
from pathlib import Path

def enhance_prompt_context(prompt, session_context):
    """Add relevant context to user prompts"""

    enhancements = []

    # Add project context
    project_info = get_project_info()
    if project_info:
        enhancements.append(f"Project context: {project_info}")

    # Add recent file context if relevant
    if any(keyword in prompt.lower() for keyword in ['bug', 'error', 'fix', 'debug']):
        recent_errors = get_recent_error_logs()
        if recent_errors:
            enhancements.append(f"Recent errors: {recent_errors}")

    # Add security context for security-related prompts
    if any(keyword in prompt.lower() for keyword in ['security', 'auth', 'login', 'password']):
        security_context = get_security_context()
        if security_context:
            enhancements.append(f"Security context: {security_context}")

    # Add performance context for performance queries
    if any(keyword in prompt.lower() for keyword in ['slow', 'performance', 'optimize', 'speed']):
        perf_context = get_performance_context()
        if perf_context:
            enhancements.append(f"Performance context: {perf_context}")

    return enhancements

def get_project_info():
    """Extract relevant project information"""
    info = []

    # Check package.json for Node.js projects
    if Path('package.json').exists():
        with open('package.json') as f:
            package_data = json.load(f)
            info.append(f"Node.js project ({package_data.get('name', 'unknown')})")

    # Check requirements.txt for Python projects
    if Path('requirements.txt').exists():
        info.append("Python project with requirements.txt")

    # Check Cargo.toml for Rust projects
    if Path('Cargo.toml').exists():
        info.append("Rust project")

    return ', '.join(info) if info else None

def get_recent_error_logs():
    """Get recent error messages from logs"""
    log_files = ['.claude/error.log', 'error.log', 'app.log']

    for log_file in log_files:
        if Path(log_file).exists():
            try:
                with open(log_file) as f:
                    lines = f.readlines()[-10:]  # Last 10 lines
                    errors = [line.strip() for line in lines if 'error' in line.lower()]
                    if errors:
                        return errors[-3:]  # Last 3 errors
            except Exception:
                pass

    return None

def get_security_context():
    """Get security-related context"""
    context = []

    # Check for authentication files
    auth_files = ['auth.py', 'authentication.py', 'login.py', 'security.py']
    for auth_file in auth_files:
        if Path(auth_file).exists():
            context.append(f"Found {auth_file}")

    # Check for config files with potential secrets
    config_files = ['.env', 'config.py', 'settings.py', 'config.json']
    for config_file in config_files:
        if Path(config_file).exists():
            context.append(f"Config file: {config_file}")

    return context if context else None

def get_performance_context():
    """Get performance-related context"""
    context = []

    # Check for performance profiling files
    perf_files = ['profile.py', 'benchmark.py', 'performance.py']
    for perf_file in perf_files:
        if Path(perf_file).exists():
            context.append(f"Performance file: {perf_file}")

    return context if context else None

# Main execution
try:
    input_data = json.load(sys.stdin)
    prompt = input_data.get('prompt', '')
    session_context = input_data.get('session_context', {})

    enhancements = enhance_prompt_context(prompt, session_context)

    if enhancements:
        print("🔍 Adding context to prompt:")
        for enhancement in enhancements:
            print(f"  + {enhancement}")

        # Save enhanced context for Claude to use
        enhanced_context = {
            'original_prompt': prompt,
            'context_enhancements': enhancements
        }

        context_file = Path('.claude/enhanced-context.json')
        with open(context_file, 'w') as f:
            json.dump(enhanced_context, f, indent=2)

except Exception as e:
    print(f"Context enhancement error: {e}", file=sys.stderr)
```

## Notification Hooks

Execute when Claude Code sends notifications to the user.

### Event Data Structure

```json
{
  "notification_type": "awaiting_input",
  "message": "Claude Code is ready for your next command",
  "context": {
    "session_duration": 3600,
    "commands_executed": 25
  }
}
```

### Use Cases

#### Multi-Channel Notifications
```bash
#!/bin/bash
# Multi-channel notification hook

NOTIFICATION_MESSAGE="$1"
CONTEXT="$2"

# Desktop notification
if command -v notify-send >/dev/null 2>&1; then
    notify-send "Claude Code" "$NOTIFICATION_MESSAGE" --icon=dialog-information
fi

# macOS notification
if command -v osascript >/dev/null 2>&1; then
    osascript -e "display notification \"$NOTIFICATION_MESSAGE\" with title \"Claude Code\""
fi

# Slack notification (if webhook configured)
if [ -n "$CLAUDE_SLACK_WEBHOOK" ]; then
    curl -X POST -H 'Content-type: application/json' \
         --data "{\"text\":\"🤖 Claude Code: $NOTIFICATION_MESSAGE\"}" \
         "$CLAUDE_SLACK_WEBHOOK"
fi

# Email notification for long sessions
SESSION_DURATION=$(echo "$CONTEXT" | jq -r '.session_duration // 0')
if [ "$SESSION_DURATION" -gt 7200 ]; then  # 2 hours
    echo "Long Claude Code session: $NOTIFICATION_MESSAGE" | mail -s "Claude Code Update" user@example.com
fi

# Log notification
echo "$(date): $NOTIFICATION_MESSAGE" >> ~/.claude/notifications.log
```

## SessionStart and SessionEnd Hooks

Execute when Claude Code sessions begin and end.

### Use Cases

#### Session Tracking
```python
#!/usr/bin/env python3
"""
Session tracking and analytics hook
"""
import json
import sys
import os
from datetime import datetime

def track_session_event(event_type):
    """Track session events for analytics"""

    session_data = {
        'event': event_type,
        'timestamp': datetime.now().isoformat(),
        'user': os.environ.get('USER'),
        'project': os.environ.get('CLAUDE_PROJECT_DIR', '').split('/')[-1],
        'session_id': os.environ.get('CLAUDE_SESSION_ID', 'unknown')
    }

    # Log to file
    log_file = Path('.claude/session-analytics.jsonl')
    with open(log_file, 'a') as f:
        f.write(json.dumps(session_data) + '\n')

    # Send to analytics service
    send_to_analytics(session_data)

    if event_type == 'session_start':
        print("📊 Session tracking started")
        initialize_session_workspace()
    else:
        print("📊 Session tracking completed")
        cleanup_session_workspace()

def send_to_analytics(session_data):
    """Send session data to analytics service"""
    # Implementation would send to your analytics platform
    pass

def initialize_session_workspace():
    """Set up workspace for new session"""
    # Create session-specific directories
    session_dir = Path(f'.claude/sessions/{datetime.now().strftime("%Y%m%d_%H%M%S")}')
    session_dir.mkdir(parents=True, exist_ok=True)

    # Initialize session state
    state = {
        'started_at': datetime.now().isoformat(),
        'files_modified': [],
        'subagents_used': [],
        'commands_executed': 0
    }

    with open(session_dir / 'state.json', 'w') as f:
        json.dump(state, f, indent=2)

def cleanup_session_workspace():
    """Clean up after session ends"""
    # Archive session data
    # Clean up temporary files
    # Generate session summary
    pass

# Main execution
event_type = sys.argv[1] if len(sys.argv) > 1 else 'unknown'
track_session_event(event_type)
```

---

Ready to create your own hooks? Continue with [Advanced Hook Patterns](/docs/hooks/advanced) for hands-on implementation guides.