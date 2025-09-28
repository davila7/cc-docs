---
sidebar_position: 1
---

# Complete CI/CD Workflow

> Build an automated documentation system that combines the Docusaurus Expert agent with Discord notifications in GitHub Actions.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    width="673"
    height="426"
    alt="Complete CI/CD workflow overview - automated documentation system with Claude Code, GitHub Actions and Discord"
    src="https://github.com/user-attachments/assets/a977ae40-8a78-4222-9578-4289fcfc0c71"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Complete automated documentation workflow combining Claude Code agents with CI/CD
  </p>
</div>

## What you'll build

By the end of this tutorial, you'll have a complete automated workflow that:

1. **Detects code changes** in pull requests
2. **Automatically installs** the Docusaurus Expert agent
3. **Analyzes changes** and updates documentation
4. **Creates a documentation PR** with the updates
5. **Sends Discord notifications** to your team

This combines everything from the previous tutorials into a production-ready system.

## Try with the example repository

The easiest way to test this workflow is with our example repository:

**Repository**: https://github.com/davila7/my-react-app

### Quick setup

1. **Clone the example repository**:
```bash
git clone https://github.com/davila7/my-react-app.git
cd my-react-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Test the Docusaurus site**:
```bash
cd docs
npm install
npm start
```

4. **Create your own repository** from this template:
   - Fork the repository on GitHub
   - Or copy the files to your own new repository

### Files to modify for your setup

Once you have the repository, you'll need to modify these files:

| File | What to change |
|------|----------------|
| `.github/workflows/docusaurus-auto-docs.yml` | Update branch names if needed (currently set to `main`) |
| `docs/.claude/settings.json` | Add your Discord webhook URL in the `env` section |
| Repository secrets | Add `ANTHROPIC_API_KEY` in GitHub Settings → Secrets |

### Test files to modify

To test the workflow, you can modify these example files:

- `src/components/Button.js` - Add new props or methods
- `src/utils/helpers.js` - Add new utility functions
- `src/hooks/useCounter.js` - Modify the custom hook
- Create new files in `src/` folder

When you create a PR with changes to these files, the workflow will automatically update the documentation in the `docs/` folder.

## Prerequisites

Before starting, make sure you have:

- ✅ **Docusaurus Expert Agent** knowledge - see [Docusaurus Expert Agent](/docs/subagents/docusaurus-expert)
- ✅ **Discord notifications hook** configured in your project - see [Discord Notification Hook](/docs/hooks/discord-notification-hook)
- ✅ **GitHub repository** with Claude Code access
- ✅ **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com)
- ✅ **Project with `.claude/hooks/discord-notifier.py` and `settings.json` configured**

## Workflow architecture

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    width="662"
    height="523"
    alt="Workflow architecture diagram showing the flow from code changes to documentation updates and Discord notifications"
    src="https://github.com/user-attachments/assets/79452a7e-15e8-4ceb-b8d0-a8e6968fd07f"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Workflow architecture showing automated documentation pipeline
  </p>
</div>

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

Now let's test the entire system end-to-end using the example repository:

### 1. Make a code change

If you're using the example repository `my-react-app`, modify one of the existing files:

```bash
# Create a new branch
git checkout -b feature/test-docs-automation

# Option A: Modify existing Button component
echo "// Updated Button component with new prop
export function Button({ children, variant = 'primary', size = 'medium' }) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {children}
    </button>
  );
}" > src/components/Button.js

# Option B: Add a new utility function
echo "// New utility functions
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}" > src/utils/helpers.js

# Commit and push
git add .
git commit -m "Add new utility functions and update Button component"
git push origin feature/test-docs-automation
```

**For your own repository**: Modify any JavaScript/TypeScript files in your `src/` folder.

### 2. Create a pull request

1. Go to your GitHub repository
2. Create a **Pull Request** from your feature branch to `main`
3. This automatically triggers the workflow

### 3. Monitor the workflow

1. Go to **Actions** tab in your repository

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    width="859"
    height="424"
    alt="GitHub Actions workflow execution showing Docusaurus Documentation Automation running"
    src="https://github.com/user-attachments/assets/2779c79e-5805-4ba8-8ae9-f395e66da227"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    GitHub Actions workflow running the automated documentation process
  </p>
</div>

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

<div style={{textAlign: 'center', margin: '1rem 0'}}>
  <img
    width="713"
    height="287"
    alt="Discord notification showing Docusaurus Expert agent activation message"
    src="https://github.com/user-attachments/assets/0867e012-d005-4080-8fcd-e6cc38cea21f"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Discord notification when Docusaurus Expert agent is activated
  </p>
</div>
   
3. **📝 Agent documenting changes** - Messages as the agent reads files and understands what needs updating

<div style={{textAlign: 'center', margin: '1rem 0'}}>
  <img
    width="701"
    height="268"
    alt="Discord notification showing agent documenting changes and reading files"
    src="https://github.com/user-attachments/assets/77c7e628-cdc8-47a9-8608-091dc2d0373c"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Agent analyzing files and documenting changes in real-time
  </p>
</div>

4. **🔧 Agent running npm run build** - Agent ensures documentation builds correctly

<div style={{textAlign: 'center', margin: '1rem 0'}}>
  <img
    width="736"
    height="288"
    alt="Discord notification showing agent running npm build to validate documentation"
    src="https://github.com/user-attachments/assets/8c118ba0-4ae1-4f00-9335-19b77fe20964"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Agent running build process to ensure documentation works correctly
  </p>
</div>

5. **✅ Documentation validated** - Agent confirms the new docs work properly
6. **📚 New PR created** - Final notification that a documentation PR has been generated

This gives your team real-time visibility into the automated documentation process!


### 5. Review the results

After the workflow completes:

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <img
    width="684"
    height="465"
    alt="Final workflow results showing generated documentation pull request"
    src="https://github.com/user-attachments/assets/d100a8a2-d3a3-431a-85ab-0c14a9a576b0"
    style={{
      borderRadius: '8px',
      border: '1px solid var(--ifm-color-emphasis-200)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  }}>
    Completed workflow showing the generated documentation pull request
  </p>
</div>

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