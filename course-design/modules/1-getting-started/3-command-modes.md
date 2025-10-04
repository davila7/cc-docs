# Command Modes

Claude Code offers multiple ways to interact with it, each suited for different scenarios. Understanding when to use each mode is key to efficient AI-assisted development.

## Overview of Command Modes

| Mode | Command | When to Use | Session Type | File Modifications |
|------|---------|-------------|--------------|-------------------|
| **Interactive** | `claude` | Complex tasks, exploration, iterative work | Persistent | Yes |
| **One-Time Task** | `claude "task"` | Single specific task with actions | One-shot | Yes |
| **Query Mode** | `claude -p "query"` | Quick questions, read-only analysis | One-shot | No |
| **Continue** | `claude -c` | Resume latest conversation | Persistent | Yes |
| **Resume** | `claude -r <id>` | Resume specific session by ID | Persistent | Yes |

**Note:** Query mode (`-p`) is designed for read-only operations and can pipe input. For tasks that modify files, use direct task mode or interactive mode.

## 1. Interactive Mode

**Command:** `claude`

**Description:** Opens a persistent conversation session where you can have multi-turn interactions.

### When to Use

- Complex tasks requiring multiple steps
- Exploratory work where you're not sure what you need
- Iterative development and refinement
- Learning and understanding your codebase

### Examples

```bash
cd /path/to/project
claude
```

```
✻ Welcome to Claude Code!

> what does this project do?
[Claude analyzes and responds]

> show me the main entry point
[Claude locates and shows the file]

> add logging to the authentication module
[Claude makes the changes]

> now write tests for those changes
[Claude creates tests]
```

### Key Features

- Maintains conversation context
- Allows follow-up questions and refinements
- Interactive file approval workflow
- Use slash commands (`/help`, `/clear`, `/exit`)

### Exit Interactive Mode

```bash
> exit
# or
> /exit
# or press Ctrl+C
```

## 2. One-Time Task Mode

**Command:** `claude "task description"`

**Description:** Executes a single task and exits.

### When to Use

- Specific, well-defined tasks
- Automation scripts
- Quick fixes or updates
- CI/CD pipelines

### Examples

```bash
# Fix a specific issue
claude "fix the bug where users can't login with email"

# Add a feature
claude "add input validation to the contact form"

# Refactor code
claude "refactor the UserService class to use async/await"

# Update documentation
claude "update the README with new installation instructions"
```

### Automation Example

```bash
#!/bin/bash
# Automated workflow script

claude "run the test suite and fix any failures"
claude "update version numbers for release 2.0"
claude "generate release notes from recent commits"
```

### Key Features

- No interactive session
- Executes task and exits
- Returns exit code (0 = success, non-zero = error)
- Perfect for scripting

## 3. Query Mode

**Command:** `claude -p "query"` or `claude --prompt "query"`

**Description:** Ask a question, get an answer, exit immediately.

### When to Use

- Quick questions about your code
- Information retrieval
- Status checks
- Learning commands or syntax

### Examples

```bash
# Code understanding
claude -p "what does the authenticate() function do?"

# File location
claude -p "where is the database configuration?"

# Technology questions
claude -p "what testing framework is this project using?"

# Statistics
claude -p "how many API endpoints does this project have?"

# Claude Code help
claude -p "how do I use slash commands?"
```

### Key Features

- Fastest mode for simple queries
- No conversation history
- Ideal for pipelines and scripts
- Great for learning

### Scripting Examples

```bash
# Get info and use in script
MAIN_FILE=$(claude -p "what is the main entry point file path?")
echo "Entry point: $MAIN_FILE"

# Pipe content for analysis (common use case)
cat error.log | claude -p "analyze these errors and suggest fixes"

# Process git diff
git diff | claude -p "review these changes for potential issues"

# Analyze test output
npm test 2>&1 | claude -p "explain why these tests are failing"
```

## 4. Continue Mode

**Command:** `claude -c` or `claude --continue`

**Description:** Resumes your most recent conversation.

### When to Use

- Continue work from where you left off
- Add to previous task
- Fix issues from last session
- Pick up interrupted work

### Example

```bash
# Previous session
claude
> add user authentication
> exit

# Later... continue that conversation
claude -c
> now add password reset functionality
```

### Key Features

- Restores full conversation context
- Maintains file change history
- Useful for interrupted work
- Seamless continuation

## 5. Resume Mode

**Command:** `claude -r` or `claude --resume`

**Description:** Select from a list of recent conversations to resume.

### When to Use

- Return to specific previous work
- Review past conversations
- Switch between different projects

### Example

```bash
claude -r
```

```
Select a conversation to resume:

1. [2 hours ago] Added authentication feature
2. [yesterday] Fixed database connection bug
3. [2 days ago] Refactored API endpoints

Select (1-3): 1
```

### Key Features

- Visual conversation picker
- Shows conversation age and summary
- Full context restoration
- Organized session management

## Choosing the Right Mode

### Decision Flow

```
Do you need an interactive conversation?
├─ YES → Start Interactive Mode (`claude`)
│
└─ NO → Do you want to continue previous work?
    ├─ YES → Continue latest (`claude -c`) or Resume specific (`claude -r <id>`)
    │
    └─ NO → Is this a quick query or one-time task?
        ├─ QUERY (read-only) → Use -p flag (`claude -p "explain this"`)
        │                       • Can pipe input: `cat file | claude -p "analyze"`
        │                       • No file modifications
        │
        └─ TASK (with actions) → Direct task (`claude "fix the bug"`)
                                 • Can modify files
                                 • Single execution
                                 • Exits after completion
```

### Best Practices

1. **Start interactive for complex work**
   ```bash
   claude  # Explore, iterate, refine
   ```

2. **Use query mode for quick info**
   ```bash
   claude -p "where is X?"
   ```

3. **One-time tasks for automation**
   ```bash
   claude "fix lint errors"
   ```

4. **Continue to pick up work**
   ```bash
   claude -c
   ```

5. **Resume for project switching**
   ```bash
   claude -r  # Pick the right conversation
   ```

## Practice Exercises

### Exercise 1: Mode Selection

For each scenario, identify the best command mode:

1. You want to explore a new codebase and understand its structure
2. You need to know which file contains the User model
3. You want to add a feature and then test it iteratively
4. Your CI pipeline needs to run tests and fix failures automatically
5. You started work yesterday on a feature and want to continue

<details>
<summary>Answers</summary>

1. Interactive mode: `claude`
2. Query mode: `claude -p "which file contains the User model?"`
3. Interactive mode: `claude`
4. One-time task: `claude "run tests and fix any failures"`
5. Continue mode: `claude -c`
</details>

### Exercise 2: Hands-On Practice

Try each mode in a real project:

```bash
# 1. Interactive session
claude
> what technologies does this project use?
> show me the package.json or requirements.txt
> exit

# 2. Query mode
claude -p "how many JavaScript files are in this project?"

# 3. One-time task
claude "add a comment to the main file explaining what it does"

# 4. Continue
claude -c
> undo that last change
```

## Command Options Reference

### Global Options

| Option | Shorthand | Description |
|--------|-----------|-------------|
| `--help` | `-h` | Show help information |
| `--version` | `-v` | Show version number |
| `--prompt` | `-p` | Run query and exit |
| `--continue` | `-c` | Continue latest conversation |
| `--resume` | `-r` | Resume from conversation list |

### Interactive Session Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/clear` | Clear conversation history |
| `/login` | Authenticate or switch accounts |
| `/exit` | Exit session |
| `exit` | Exit session (alias) |
| Ctrl+C | Force exit |

## Next Steps

Now that you understand command modes, learn how to [Navigate Your Codebase](./4-codebase-navigation.md) effectively using natural language.

## Additional Resources

- [CLI Reference](https://docs.anthropic.com/claude/docs/cli-reference)
- [Interactive Mode Guide](https://docs.anthropic.com/claude/docs/interactive-mode)
- [Slash Commands](https://docs.anthropic.com/claude/docs/slash-commands)
