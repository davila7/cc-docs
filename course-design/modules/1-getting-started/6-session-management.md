# Session Management

Effective session management helps you maintain context, organize your work, and maximize productivity with Claude Code. This guide covers conversation history, context preservation, and best practices for managing sessions.

## Understanding Sessions

A **session** is a conversation with Claude Code that:
- Maintains context across multiple interactions
- Remembers previous questions and changes
- Tracks file modifications
- Preserves your workflow state

### Session Types

| Type | Duration | Context | Use Case |
|------|----------|---------|----------|
| **Active** | Current conversation | Full context | Ongoing work |
| **Recent** | Last few hours | Resumable | Return to recent work |
| **Archived** | Older conversations | Stored | Historical reference |

## Managing Conversation History

### Viewing History

Access previous messages in your current session:

```bash
# Scroll up in terminal to see history
# Or ask Claude to recall
> what did we discuss earlier?
> what changes have we made so far?
```

### Clearing History

Clear conversation history when:
- Starting a completely new task
- Context becomes cluttered
- You want a fresh start

```bash
# In interactive session
> /clear
```

**What gets cleared:**
- Conversation messages
- Context from previous questions
- Mental model of what you're working on

**What stays:**
- File changes already made
- Git history
- Project state

### When to Clear vs Continue

**Clear when:**
```bash
# Switching to unrelated task
> /clear
> now let's work on the email service

# Context is confusing Claude
> /clear
> let's start fresh with this bug

# Starting a new feature
> /clear
> new task: implement dark mode
```

**Continue when:**
```bash
# Related follow-up work
> now add tests for what we just built

# Iterating on same feature
> that works, but make it faster

# Building on previous changes
> use that same pattern for the admin panel
```

## Session Continuation

### Continue Latest Session

Resume your most recent conversation:

```bash
claude -c
# or
claude --continue
```

**When to use:**
- You just closed Claude Code
- Picking up where you left off
- Interrupted work

**Example workflow:**
```bash
# Morning: Start working on feature
claude
> implement user profile editing
> exit

# Afternoon: Continue the work
claude -c
> now add profile picture upload
```

### Resume Specific Session

Select from recent conversations:

```bash
claude -r
# or
claude --resume
```

**Interactive picker:**
```
Select a conversation to resume:

1. [2 hours ago] Implement user authentication
2. [yesterday] Fix database connection issues
3. [2 days ago] Add API documentation
4. [3 days ago] Refactor payment service

Select (1-4): 2
```

**When to use:**
- Working on multiple projects
- Returning to paused work
- Need specific context

## Context Management

### Understanding Context Limits

Claude Code maintains context within limits:
- **Recent messages** are fully remembered
- **Older messages** may be summarized
- **Very long sessions** might lose early context

### Preserving Important Context

**Method 1: Summarize before closing**
```bash
> summarize what we accomplished in this session
> list all the files we modified
> what should I remember for next time?
> exit
```

**Method 2: Create reference documents**
```bash
> create a TODO.md file with remaining tasks
> add comments to the code explaining our approach
> update the README with what we built
```

**Method 3: Use Git commits**
```bash
> commit these changes with a descriptive message
# The commit message preserves context
```

### Providing Context to New Sessions

When starting fresh or resuming:

```bash
# Provide context explicitly
> I'm working on the authentication feature. Previously I added login, now I need to add password reset

# Reference files
> look at UserController.js - we need to add similar logic for admins

# Share session summary
> last session we built the API, now let's build the UI
```

## Multi-Project Workflows

### Strategy 1: Separate Sessions per Project

```bash
# Project A
cd /path/to/project-a
claude
> work on feature X
> exit

# Project B
cd /path/to/project-b
claude
> work on feature Y
> exit

# Resume Project A later
cd /path/to/project-a
claude -c
```

### Strategy 2: Clear Between Projects

```bash
# In same terminal window
cd /path/to/project-a
claude
> work on feature X
> /clear  # Clear before switching

cd /path/to/project-b
> work on feature Y
```

### Strategy 3: Use Resume for Switching

```bash
# Work on multiple projects
claude -r  # Pick the right conversation
```

## Session Best Practices

### 1. Start Sessions with Clear Intent

```bash
# ✅ Good: Clear purpose
claude
> I need to add user registration with email verification

# ❌ Unclear: No direction
claude
> help
```

### 2. End Sessions Cleanly

```bash
# ✅ Good: Proper closure
> summarize what we did
> commit the changes
> exit

# ❌ Abrupt: Just closing terminal
# (Context might be lost)
```

### 3. Use Descriptive Tasks

Claude uses your task descriptions to name sessions:

```bash
# ✅ Good: Descriptive
claude "implement OAuth login with Google"
# Session name: "Implement OAuth login with Google"

# ❌ Poor: Generic
claude "fix stuff"
# Session name: "Fix stuff"
```

### 4. Manage Context Actively

```bash
# Periodically check context
> what are we working on?
> what have we changed so far?

# Reset when needed
> /clear
> new focus: performance optimization
```

### 5. Document Long Sessions

For sessions spanning multiple days:

```bash
# Day 1
> create a SESSION_NOTES.md file
> add notes: "Day 1 - Built authentication API, still need to add refresh tokens"
> exit

# Day 2
claude -c
> read SESSION_NOTES.md
> update notes: "Day 2 - Added refresh tokens, need to test"
```

## Common Session Patterns

### Pattern 1: Feature Development

```bash
# Session 1: Planning
claude
> analyze codebase for adding search feature
> where should search logic go?
> exit

# Session 2: Implementation
claude -c
> implement the search feature in the right location
> exit

# Session 3: Testing
claude -c
> write tests for the search feature
> exit

# Session 4: Documentation
claude -c
> document the search feature in README
> commit all changes
> exit
```

### Pattern 2: Bug Investigation

```bash
# Session 1: Reproduce
claude
> help me reproduce this bug: users can't login
> exit

# Session 2: Debug
claude -c
> found the issue, it's in auth middleware
> fix it
> exit

# Session 3: Verify
claude -c
> test the fix works
> add regression tests
> commit
> exit
```

### Pattern 3: Refactoring

```bash
# Single long session with checkpoints
claude
> refactor UserService to use dependency injection

[Make changes]

> commit these changes as checkpoint

> now refactor AuthService the same way

[Make changes]

> commit again

> summarize all refactoring done
> exit
```

## Troubleshooting Sessions

### "Claude forgot what we were doing"

**Solution 1: Provide context**
```bash
> we were implementing user profiles. So far we added the profile model and API endpoint. Now we need the UI.
```

**Solution 2: Resume specific session**
```bash
> exit
claude -r  # Pick the right session
```

**Solution 3: Check recent changes**
```bash
> what files have we modified?
> show me the recent git commits
```

### "Too much unrelated context"

**Solution: Clear and start focused**
```bash
> /clear
> I want to focus only on fixing the login bug now
```

### "Lost track of changes"

**Solution: Review session work**
```bash
> list all files we modified in this session
> show me a diff of our changes
> what were the main tasks we completed?
```

### "Need to switch tasks urgently"

**Solution: Checkpoint and switch**
```bash
> commit current work with message "WIP: feature half done"
> /clear
> [work on urgent task]
> exit

# Later, resume original work
claude -r  # Pick the WIP session
```

## Session Management Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/clear` | Clear conversation history | `> /clear` |
| `claude -c` | Continue latest session | `claude -c` |
| `claude -r` | Resume from list | `claude -r` |
| `/exit` | End current session | `> /exit` |
| `exit` | End current session | `> exit` |
| Ctrl+C | Force exit | `^C` |

## Practice Exercises

### Exercise 1: Session Flow

Practice this workflow:

1. Start a session and make some changes
2. Exit and continue the session
3. Clear history and start a new topic
4. Resume a previous session from the list

```bash
# Step 1
claude
> add a hello function
> exit

# Step 2
claude -c
> now add a goodbye function
> exit

# Step 3
claude
> /clear
> different task: update README
> exit

# Step 4
claude -r
# Select the first session
> add a welcome function too
```

### Exercise 2: Context Preservation

Practice preserving context:

1. Start a multi-step task
2. Document progress before exiting
3. Resume and continue based on notes

```bash
# Step 1
claude
> implement user registration - step 1: create model
> create PROGRESS.md noting we completed the model
> exit

# Step 2
claude -c
> read PROGRESS.md
> step 2: create API endpoint
> update PROGRESS.md
```

### Exercise 3: Multi-Project Management

Practice switching between projects:

```bash
# Work on Project A
cd ~/project-a
claude
> add feature X
> commit changes
> exit

# Work on Project B
cd ~/project-b
claude
> fix bug Y
> commit changes
> exit

# Back to Project A
cd ~/project-a
claude -c
> continue feature X
```

## Next Steps

Congratulations! You've completed Module 1. You now know how to:
- ✅ Install and authenticate Claude Code
- ✅ Use different command modes
- ✅ Navigate codebases with natural language
- ✅ Make code modifications safely
- ✅ Manage sessions effectively

Proceed to the [Module Assessment](./assessment.md) to test your knowledge, or continue to [Module 2: Core Development Workflows](../2-core-workflows/README.md).

## Additional Resources

- [Interactive Mode Documentation](https://docs.anthropic.com/claude/docs/interactive-mode)
- [CLI Reference](https://docs.anthropic.com/claude/docs/cli-reference)
- [Best Practices Guide](https://docs.anthropic.com/claude/docs/best-practices)
