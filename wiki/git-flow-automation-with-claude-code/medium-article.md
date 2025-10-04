# Automating Git Flow with Claude Code: Building a Smart Branching Workflow with Subagents, Slash Commands, and Hooks

In this article, I'll show you how to build an automated Git Flow system using Claude Code. You'll learn to set up specialized agents, custom commands, and hooks that enforce branching strategies and streamline your development workflow.

We'll cover subagent installation, slash command creation, hook configuration, and best practices for maintaining a clean Git Flow process across your team.

## What is Git Flow?

Git Flow is a branching model designed for managing releases and features in a structured way. It defines specific branch types:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features in development
- **release/***: Release preparation
- **hotfix/***: Emergency production fixes

Following Git Flow manually can be tedious and error-prone. Let's automate it with Claude Code!

## Initial Setup: Understanding the Components

Before we start, let's understand the five components we'll use:

1. **Subagent**: A specialized AI assistant focused on Git Flow operations
2. **Slash Commands**: Quick shortcuts for common Git Flow tasks
3. **Hooks**: Automated validation and enforcement rules
4. **Statusline**: Real-time Git Flow status display in your terminal
5. **Settings**: Permission and environment configuration

## Step 1: Install the Git Flow Subagent

Start by adding the Git Flow manager subagent with this command:

```bash
npx claude-code-templates@latest --agent=git/git-flow-manager --yes
```

You can see more details about the agent at this link: https://www.aitmpl.com/component/agent/git-flow-manager

![Installing Git Flow Manager Agent](image-placeholder.png)

This agent provides specialized context for Git Flow operations, including:
- Branch naming validation
- Merge conflict detection
- Commit message standardization
- Release tagging automation
- Pull request generation

### Verify Installation

Check that the agent was installed correctly:

```bash
ls .claude/agents/
```

You should see `git-flow-manager.md` in the output.

## Step 2: Install Git Flow Slash Commands

Now let's add the slash commands that make Git Flow operations quick and easy:

```bash
npx claude-code-templates@latest --command=git/feature --yes
npx claude-code-templates@latest --command=git/release --yes
npx claude-code-templates@latest --command=git/hotfix --yes
npx claude-code-templates@latest --command=git/finish --yes
npx claude-code-templates@latest --command=git/flow-status --yes
```

![Installing Git Flow Commands](image-placeholder.png)

These commands will be available in Claude Code as:
- `/feature [name]` - Start a new feature branch
- `/release [version]` - Create a release branch
- `/hotfix [name]` - Create a hotfix branch
- `/finish` - Complete current branch (merge, tag, cleanup)
- `/flow-status` - Show Git Flow status

### Test Your Commands

Start Claude Code and try:

```
> /flow-status
```

You should see the current Git Flow state of your repository.

## Step 3: Install Git Flow Hooks

Hooks provide automated validation and prevent common mistakes. Install them with:

```bash
npx claude-code-templates@latest --hook=git/prevent-direct-push --yes
npx claude-code-templates@latest --hook=git/validate-branch-name --yes
npx claude-code-templates@latest --hook=git/conventional-commits --yes
```

![Installing Git Flow Hooks](image-placeholder.png)

These hooks will:
1. **prevent-direct-push**: Block direct pushes to main/develop
2. **validate-branch-name**: Ensure branches follow Git Flow naming
3. **conventional-commits**: Format commit messages consistently

### Understanding Hook Behavior

Let's break down what each hook does:

#### Hook 1: Prevent Direct Push

This PreToolUse hook intercepts git push commands:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/prevent-direct-push.sh"
          }
        ]
      }
    ]
  }
}
```

If you try to push directly to `main` or `develop`, you'll see:

```
❌ Direct push to main/develop is not allowed!
Please create a feature branch and submit a PR.
```

#### Hook 2: Validate Branch Names

This hook ensures all branches follow Git Flow conventions:

```bash
# Valid branch names:
feature/user-authentication
release/v1.2.0
hotfix/critical-bug-fix

# Invalid branch names:
my-new-feature
fix-bug
random-branch
```

#### Hook 3: Conventional Commits

Automatically formats your commits:

```bash
# Before hook:
"fixed the login bug"

# After hook:
"fix(auth): resolve login validation error

- Updated password validation logic
- Added error handling for edge cases

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Step 4: Install Git Flow Statusline

A statusline provides real-time Git Flow information directly in your Claude Code interface. Install it with:

```bash
npx claude-code-templates@latest --statusline=git/git-flow-status --yes
```

![Installing Git Flow Statusline](image-placeholder.png)

### What Does the Statusline Show?

Once installed, you'll see Git Flow status at the top of your Claude Code terminal:

```
🌿 feature/user-auth | ↑2 ↓1 | ●3 ✚5 ✖1 | 🎯 → develop
```

This displays:
- **🌿 Branch name** with type icon (🌿 feature, 🚀 release, 🔥 hotfix)
- **↑↓ Sync status** - commits ahead/behind remote
- **●✚✖ Changes** - modified, added, deleted files
- **🎯 Target** - where this branch will merge

That's it! The statusline automatically updates as you work, giving you instant visibility into your Git Flow state.

## Step 5: Configure Settings

Install the Git Flow settings configuration with:

```bash
npx claude-code-templates@latest --setting=git/git-flow-settings --yes
```

![Settings Configuration](image-placeholder.png)

This automatically configures:
- **Statusline**: Displays Git Flow status in real-time
- **Permissions**: Denies dangerous operations (force push, direct push to main/develop)
- **Allowed operations**: Git Flow operations and feature branch pushes
- **Environment variables**: Branch naming conventions for your team

Alternatively, you can manually create `.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "$CLAUDE_PROJECT_DIR/.claude/statusline.sh"
  },
  "permissions": {
    "deny": [
      "Bash(git push origin main:*)",
      "Bash(git push origin develop:*)",
      "Bash(git push --force:*)"
    ],
    "allow": [
      "Bash(git flow:*)",
      "Bash(git checkout:*)",
      "Bash(git commit:*)",
      "Bash(git push origin feature/*:*)",
      "Bash(git push origin release/*:*)",
      "Bash(git push origin hotfix/*:*)"
    ]
  },
  "env": {
    "GIT_FLOW_MAIN_BRANCH": "main",
    "GIT_FLOW_DEVELOP_BRANCH": "develop",
    "GIT_FLOW_PREFIX_FEATURE": "feature/",
    "GIT_FLOW_PREFIX_RELEASE": "release/",
    "GIT_FLOW_PREFIX_HOTFIX": "hotfix/"
  }
}
```

## Real-World Usage Examples

### Example 1: Starting a New Feature

```bash
# In Claude Code
> /feature user-profile-page

# Claude responds:
✓ Created and switched to branch: feature/user-profile-page
✓ Branch tracking set to origin/feature/user-profile-page
📝 You can now start working on your feature

> implement a user profile page with avatar upload and bio editing
```

The git-flow-manager agent will:
1. Validate the feature name
2. Create the branch from `develop`
3. Set up tracking
4. Provide context-aware coding assistance

### Example 2: Finishing a Feature

```bash
> /finish

# Claude validates and executes:
✓ Running tests...
✓ All tests passed
✓ Merging feature/user-profile-page into develop
✓ Deleting local branch
✓ Pushing changes to origin

Would you like me to create a pull request? (y/n)
```

### Example 3: Creating a Release

```bash
> /release v1.2.0

# Claude handles:
✓ Creating release/v1.2.0 from develop
✓ Updating version in package.json
✓ Generating CHANGELOG.md
✓ Creating release PR to main

Release branch ready for final testing!
```

### Example 4: Emergency Hotfix

```bash
> /hotfix critical-security-patch

# Immediate action:
✓ Creating hotfix/critical-security-patch from main
✓ Branch ready for emergency fix
⚠️  Remember: hotfix will merge to both main AND develop
```

## Advanced: Customizing Components

### Customize the Subagent

Edit `.claude/agents/git-flow-manager.md` to add project-specific rules:

```markdown
---
name: git-flow-manager
description: Manages Git Flow operations for this project
tools: Bash, Read, Write, Grep, Glob
---

You are a Git Flow expert for this project.

## Project-Specific Rules:
- All commits must reference a Jira ticket (e.g., "feat(PROJ-123): ...")
- Release branches require approval from 2 reviewers
- Hotfixes must include a rollback plan
- Feature branches must update relevant documentation

## Branch Naming:
- Features: feature/PROJ-{ticket}-{description}
- Releases: release/v{major}.{minor}.{patch}
- Hotfixes: hotfix/PROJ-{ticket}-{description}

[Rest of agent configuration...]
```

### Customize Slash Commands

Edit `.claude/commands/feature.md`:

```markdown
---
description: Create a new feature branch with Jira integration
argument-hint: [PROJ-ticket] [description]
allowed-tools: Bash(git:*), Read, Write
---

Create a feature branch following this workflow:

1. Verify we're on develop branch
2. Pull latest changes
3. Create branch: feature/PROJ-$1-$2
4. Set up tracking
5. Create initial commit with branch name

Then ask: "What feature would you like to implement for $1?"
```

### Customize Hooks

Edit `.claude/hooks/conventional-commits.sh`:

```bash
#!/bin/bash

# Read the tool input
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Check if it's a git commit
if [[ "$COMMAND" =~ ^git\ commit ]]; then
  # Extract commit message
  MESSAGE=$(echo "$COMMAND" | sed -n 's/.*-m "\(.*\)"/\1/p')

  # Validate conventional commit format
  if ! [[ "$MESSAGE" =~ ^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: ]]; then
    # Block and provide feedback
    echo "❌ Commit message must follow conventional commits format!"
    echo "Examples:"
    echo "  feat(auth): add login functionality"
    echo "  fix(api): resolve timeout issue"
    exit 2  # Exit code 2 blocks the tool
  fi
fi

# Allow the command
exit 0
```

## Team Collaboration: Sharing Your Setup

### Option 1: Share via Git (Recommended)

Commit your Claude Code configuration to share with your team:

```bash
git add .claude/
git commit -m "chore: add Git Flow automation with Claude Code"
git push origin develop
```

Now teammates can use the same workflow by:

```bash
git pull
# All agents, commands, and hooks are ready to use!
```

### Option 2: Create a Setup Script

Create `scripts/setup-claude-git-flow.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up Git Flow automation with Claude Code..."

# Install agent
npx claude-code-templates@latest --agent=git/git-flow-manager --yes

# Install commands
npx claude-code-templates@latest --command=git/feature --yes
npx claude-code-templates@latest --command=git/release --yes
npx claude-code-templates@latest --command=git/hotfix --yes
npx claude-code-templates@latest --command=git/finish --yes
npx claude-code-templates@latest --command=git/flow-status --yes

# Install hooks
npx claude-code-templates@latest --hook=git/prevent-direct-push --yes
npx claude-code-templates@latest --hook=git/validate-branch-name --yes
npx claude-code-templates@latest --hook=git/conventional-commits --yes

echo "✅ Git Flow automation setup complete!"
echo "Run 'claude' to start using it"
```

Make it executable and share:

```bash
chmod +x scripts/setup-claude-git-flow.sh
./scripts/setup-claude-git-flow.sh
```

## GitHub Actions Integration

Automate Git Flow validation in CI/CD:

### Workflow 1: Branch Name Validation

Create `.github/workflows/validate-branch.yml`:

```yaml
name: Validate Git Flow Branch

on:
  pull_request:
    branches:
      - develop
      - main

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate branch name
        run: |
          BRANCH="${{ github.head_ref }}"

          if [[ ! "$BRANCH" =~ ^(feature|release|hotfix)/ ]]; then
            echo "❌ Invalid branch name: $BRANCH"
            echo "Branch must start with: feature/, release/, or hotfix/"
            exit 1
          fi

          echo "✅ Valid Git Flow branch name: $BRANCH"
```

### Workflow 2: Automated Release Notes

Create `.github/workflows/release-notes.yml`:

```yaml
name: Generate Release Notes

on:
  pull_request:
    branches:
      - main
    types:
      - opened

jobs:
  generate-notes:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Claude configuration
        run: |
          mkdir -p .claude/agents
          if [ ! -f ".claude/agents/git-flow-manager.md" ]; then
            npx claude-code-templates@latest \
              --agent git/git-flow-manager \
              --yes \
              --directory .
          fi

      - name: Generate release notes
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Use the git-flow-manager agent to generate release notes for this PR.

            1. Read all commits since the last release
            2. Categorize changes (Features, Fixes, Breaking Changes)
            3. Create a CHANGELOG.md entry
            4. Update package.json version if needed

            PR branch: ${{ github.head_ref }}
            Target: ${{ github.base_ref }}
          claude_args: "--max-turns 10 --dangerously-skip-permissions"

      - name: Commit release notes
        run: |
          git config user.name "Claude Code Bot"
          git config user.email "noreply@anthropic.com"
          git add CHANGELOG.md package.json
          git commit -m "docs: update release notes" || echo "No changes"
          git push
```

### Workflow 3: Enforce Conventional Commits

Create `.github/workflows/lint-commits.yml`:

```yaml
name: Lint Commit Messages

on:
  pull_request:
    branches:
      - develop
      - main

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Validate commit messages
        run: |
          # Get commits in this PR
          COMMITS=$(git log --pretty=format:"%s" \
            origin/${{ github.base_ref }}..HEAD)

          # Check each commit
          while IFS= read -r commit; do
            if ! [[ "$commit" =~ ^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: ]]; then
              echo "❌ Invalid commit message: $commit"
              echo "Must follow: type(scope): description"
              exit 1
            fi
          done <<< "$COMMITS"

          echo "✅ All commits follow conventional format"
```

## Configure GitHub Secrets

Add your Anthropic API key to GitHub:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your API key from https://console.anthropic.com/

![GitHub Secrets Configuration](image-placeholder.png)

Enable workflow permissions:

1. Settings → Actions → General → Workflow permissions
2. Select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

![Workflow Permissions](image-placeholder.png)

## Best Practices and Tips

### 1. Start Small

Don't implement everything at once:
- Week 1: Install subagent only
- Week 2: Add slash commands
- Week 3: Introduce hooks
- Week 4: Configure GitHub Actions

### 2. Team Training

Create a quick reference guide:

```markdown
# Git Flow Quick Reference

## Starting Work
> /feature my-feature-name
> implement the feature...

## Finishing Work
> /finish
(Creates PR automatically)

## Releases
> /release v1.2.0
(Handles version bump, changelog, tags)

## Hotfixes
> /hotfix critical-bug
(Fast-track from main)

## Status Check
> /flow-status
(See current state)
```

### 3. Monitor Hook Performance

If hooks slow down your workflow:

```json
{
  "disableAllHooks": false,
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git push:*)",
        "hooks": [/* only essential validations */]
      }
    ]
  }
}
```

### 4. Gradual Permission Tightening

Start permissive, then restrict:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",  // Week 1
    // "defaultMode": "ask",       // Week 2-3
    // "defaultMode": "minimal",   // Week 4+
    "deny": [
      // Add restrictions gradually
    ]
  }
}
```

### 5. Document Your Customizations

Create `.claude/README.md`:

```markdown
# Claude Code Git Flow Setup

## Our Git Flow Rules
- Features: feature/PROJ-{ticket}-{description}
- Commits: Must include Jira ticket reference
- PRs: Require 2 approvals for releases

## Custom Commands
- `/feature [PROJ-ticket] [name]` - Start feature
- `/finish` - Complete and create PR
- `/release [version]` - Start release process

## Hooks
- Prevents direct push to main/develop
- Validates branch names
- Enforces conventional commits

## Need Help?
Slack: #claude-code-help
Docs: confluence.company.com/claude-code
```

## Troubleshooting Common Issues

### Issue 1: Hook Not Running

**Problem**: Hooks don't seem to execute

**Solution**: Check hook file permissions

```bash
chmod +x .claude/hooks/*.sh
ls -la .claude/hooks/
```

### Issue 2: Branch Name Rejected

**Problem**: "Invalid branch name" error

**Solution**: Check your naming convention

```bash
# View current rules
cat .claude/hooks/validate-branch-name.sh

# Update pattern if needed
# Edit the regex to match your conventions
```

### Issue 3: Subagent Not Found

**Problem**: "Agent 'git-flow-manager' not found"

**Solution**: Verify installation

```bash
ls .claude/agents/
cat .claude/agents/git-flow-manager.md

# Reinstall if missing
npx claude-code-templates@latest --agent=git/git-flow-manager --yes
```

### Issue 4: Permission Denied in CI

**Problem**: GitHub Actions can't run git commands

**Solution**: Update workflow permissions

```yaml
jobs:
  your-job:
    permissions:
      contents: write      # ← Add this
      pull-requests: write # ← Add this
      id-token: write     # ← Add this
```

## Conclusion

You now have a fully automated Git Flow system powered by Claude Code! Here's what you've built:

✅ **Subagent**: Intelligent Git Flow assistant
✅ **Slash Commands**: Quick workflow shortcuts
✅ **Hooks**: Automated validation and enforcement
✅ **Statusline**: Real-time Git Flow status display
✅ **Settings**: Secure permission boundaries
✅ **GitHub Actions**: CI/CD integration

### What's Next?

Extend your setup with:
- **Deployment automation**: Auto-deploy from release branches
- **Changelog generation**: Automated release notes
- **Semantic versioning**: Automatic version bumps
- **Branch cleanup**: Auto-delete merged branches
- **Metrics tracking**: Git Flow analytics

### Resources

- Claude Code Documentation: https://docs.claude.com/claude-code
- Claude Code Templates: https://www.aitmpl.com
- Git Flow Original Spec: https://nvie.com/posts/a-successful-git-branching-model/
- Conventional Commits: https://www.conventionalcommits.org/

Happy coding with automated Git Flow! 🚀

---

*Have questions or suggestions? Leave a comment below or reach out on Twitter [@your_handle]*
