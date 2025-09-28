---
sidebar_position: 1
---

# Complete CI/CD Workflow

> Build an automated documentation system that combines the Docusaurus Expert agent with Discord notifications in GitHub Actions.

<img width="673" height="426" alt="Screenshot 2025-09-28 at 14 52 27" src="https://github.com/user-attachments/assets/a977ae40-8a78-4222-9578-4289fcfc0c71" />

## What you'll build

By the end of this tutorial, you'll have a complete automated workflow that:

1. **Detects code changes** in pull requests
2. **Automatically installs** the Docusaurus Expert agent
3. **Analyzes changes** and updates documentation
4. **Creates a documentation PR** with the updates
5. **Sends Discord notifications** to your team

This combines everything from the previous tutorials into a production-ready system.

## Prerequisites

Before starting, make sure you have:

- ✅ **Docusaurus Expert Agent** knowledge - see [Docusaurus Expert Agent](/docs/subagents/docusaurus-expert)
- ✅ **Discord notifications hook** configured in your project - see [Discord Notification Hook](/docs/hooks/discord-notification-hook)
- ✅ **GitHub repository** with Claude Code access
- ✅ **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com)
- ✅ **Project with `.claude/hooks/discord-notifier.py` and `settings.json` configured**

## Workflow architecture

<img width="662" height="523" alt="Screenshot 2025-09-28 at 15 12 38" src="https://github.com/user-attachments/assets/79452a7e-15e8-4ceb-b8d0-a8e6968fd07f" />

## Install Claude GitHub App

First, you need to install the Claude GitHub App to allow Claude Code to interact with your repository:

1. **In your Claude Code terminal**, run:
   ```bash
   /install-github-app
   ```

2. **Authenticate** with your GitHub account
3. **Install the Claude app** - You can authorize all repositories or select specific ones
4. **Complete the installation** back in the console
5. **Configure permissions** - Choose if you want PR reviews or @claude tagging

## Create the workflow file

Create `.github/workflows/docusaurus-auto-docs.yml` in your repository:

```yaml title=".github/workflows/docusaurus-auto-docs.yml"
name: Docusaurus Documentation Automation

on:
  pull_request:
    branches:
      - main  # Change to your default branch
    paths:
      # Add file types that should trigger documentation updates
      - '**.js'
      - '**.ts'
      - '**.jsx'
      - '**.tsx'
      - '**.py'
      - '**.java'
      # Exclude paths that shouldn't trigger documentation
      - '!.github/**'
      - '!**/node_modules/**'
      - '!**/dist/**'
      - '!**/build/**'
      - '!docs/**'  # CRITICAL: Prevents infinite loops

jobs:
  auto-document:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history needed for proper diff

      # Install the Docusaurus Expert agent (if not already in project)
      - name: Setup Claude configuration
        run: |
          # Install agent if not exists in the project
          if [ ! -f ".claude/agents/docusaurus-expert.md" ]; then
            npx claude-code-templates@latest \
              --agent documentation/docusaurus-expert \
              --yes \
              --directory .
          fi

      # Get changed files for context
      - name: Get changed files
        id: changed
        run: |
          # Fetch the base branch
          git fetch origin ${{ github.event.pull_request.base.ref }}:${{ github.event.pull_request.base.ref }}

          # Get changed files and save to output
          CHANGED_FILES=$(git diff --name-only ${{ github.event.pull_request.base.ref }}...HEAD | tr '\n' ' ')
          echo "files=$CHANGED_FILES" >> $GITHUB_OUTPUT

      # Execute Claude Code with the Docusaurus Expert agent
      - name: Update documentation
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Read and follow the instructions in .claude/agents/docusaurus-expert.md

            Changed files in this pull request:
            ${{ steps.changed.outputs.files }}

            ## Requirements
            1. Find the Docusaurus documentation (check: docs/, docu/, documentation/, website/docs/)
            2. Update documentation for any changed functionality
            3. Add new documentation for new features
            4. Update API references if function signatures changed
            5. Ensure all code examples match the current implementation

            ## Project-specific rules
            - Documentation language: English
            - Code examples should include TypeScript types where applicable
            - Follow existing documentation structure and style
            - Update getting-started.md for new features
            - Create feature-specific documentation files when appropriate

            Focus on documenting the changes found in the modified files above.
          claude_args: "--max-turns 15 --dangerously-skip-permissions"

      # Create PR with documentation updates
      - name: Create Documentation Pull Request
        id: create-pr
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "docs: update via docusaurus-expert agent"
          title: "📚 Documentation Update"
          body: "Automated documentation update based on pull request changes.\n\n**Changed files:**\n```\n${{ steps.changed.outputs.files }}\n```\n\nThis PR was automatically generated by the Docusaurus Expert agent."
          branch: docs/auto-${{ github.sha }}
          base: main
```

## Configure GitHub secrets

Go to your repository **Settings → Secrets and variables → Actions** and add these secrets:

### Required secrets:

| Secret Name | Where to get it | Purpose |
|-------------|-----------------|----------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Allows Claude Code to run in GitHub Actions |

**Note:** Discord notifications will be sent automatically by the hook configured in your project's `settings.json` when Claude Code executes tools during the workflow.

## Enable workflow permissions

In your repository **Settings → Actions → General → Workflow permissions**:

1. ✅ **Read repository contents and packages permissions**
2. ✅ **Allow GitHub Actions to create and approve pull requests**

These permissions are required for the workflow to:
- Read your code changes
- Create documentation pull requests
- Comment on existing pull requests

## Test the complete workflow

Now let's test the entire system end-to-end:

### 1. Make a code change

Create a new branch and modify a JavaScript/TypeScript file:

```bash
git checkout -b feature/test-docs-automation
echo "export function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }" > utils.js
git add utils.js
git commit -m "Add calculateTotal utility function"
git push origin feature/test-docs-automation
```

### 2. Create a pull request

1. Go to your GitHub repository
2. Create a **Pull Request** from your feature branch to `main`
3. The workflow will **automatically trigger**

### 3. Monitor the workflow

1. Go to **Actions** tab in your repository

<img width="859" height="424" alt="Screenshot 2025-09-28 at 16 03 44" src="https://github.com/user-attachments/assets/2779c79e-5805-4ba8-8ae9-f395e66da227" />

2. Look for "Docusaurus Documentation Automation"
3. Click on the running workflow to see live logs
4. Watch each step execute:
   - ✅ Setup Claude configuration
   - ✅ Get changed files
   - ✅ Update documentation (Discord notifications sent automatically)
   - ✅ Create Documentation Pull Request

### 4. Watch Discord notifications in real-time

As the workflow executes, you'll see Discord messages showing the agent's progress:

1. **🤖 Docusaurus Expert agent activated** - Agent starts analyzing the PR changes

<img width="713" height="287" alt="Screenshot 2025-09-28 at 16 27 15" src="https://github.com/user-attachments/assets/0867e012-d005-4080-8fcd-e6cc38cea21f" />
   
3. **📝 Agent documenting changes** - Messages as the agent reads files and understands what needs updating

<img width="701" height="268" alt="Screenshot 2025-09-28 at 16 27 40" src="https://github.com/user-attachments/assets/77c7e628-cdc8-47a9-8608-091dc2d0373c" />

4. **🔧 Agent running npm run build** - Agent ensures documentation builds correctly

<img width="736" height="288" alt="Screenshot 2025-09-28 at 16 28 25" src="https://github.com/user-attachments/assets/8c118ba0-4ae1-4f00-9335-19b77fe20964" />

5. **✅ Documentation validated** - Agent confirms the new docs work properly
6. **📚 New PR created** - Final notification that a documentation PR has been generated

This gives your team real-time visibility into the automated documentation process!


### 5. Review the results

After the workflow completes:

<img width="684" height="465" alt="Screenshot 2025-09-28 at 16 22 01" src="https://github.com/user-attachments/assets/d100a8a2-d3a3-431a-85ab-0c14a9a576b0" />

1. **Check for a new PR** with title "📚 Documentation Update"
2. **Review the documentation changes** made by the agent
4. **Merge the documentation PR** if the changes look good

## Troubleshooting

### ❌ Workflow doesn't trigger

**Check your file paths:**
```bash
# Make sure your changes match the workflow paths
git diff --name-only origin/main
```

### ❌ Anthropic API key error

1. Verify the secret exists: **Settings → Secrets → ANTHROPIC_API_KEY**
2. Check the key is valid at [console.anthropic.com](https://console.anthropic.com)
3. Make sure you have API credits available

### ❌ Discord notification fails

Test your webhook manually:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🧪 Test message from workflow"}'
```

### ❌ Permission errors

1. Check **Settings → Actions → General → Workflow permissions**
2. Enable "Allow GitHub Actions to create and approve pull requests"
3. Verify the GitHub token has proper permissions

## What's next?

Congratulations! You now have a complete automated documentation system. Here's what you can do next:

1. **Customize the agent prompt** for your specific project needs
2. **Add more file types** to monitor for changes
3. **Set up team reviewers** for documentation PRs
4. **Create additional hooks** for other notifications (Slack, email, etc.)
5. **Monitor and refine** the documentation quality over time