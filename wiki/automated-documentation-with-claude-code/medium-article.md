# Automated Documentation with Claude Code: Building Self-Updating Docs Using Docusaurus Agent

In this article, I’ll show you how to build an automated documentation system using Claude Code and Docusaurus. You’ll learn to set up a documentation agent that analyzes code changes and updates project documentation automatically.

We’ll cover Docusaurus setup, agent installation, automated workflows, and CI/CD integration that keeps docs synchronized with your codebase.

## Initial Setup
First, create your Docusaurus site in your project:

npx create-docusaurus@latest my-docs classic
Follow the CLI steps to install Docusaurus… Always TypeScript! Just kidding, choose whatever you want.

Press enter or click to view image in full size

Run npm start and then open localhost... Voila, you now have your documentation site ready and prepared for customization and writing your project information.

Press enter or click to view image in full size

Press enter or click to view image in full size

You can check the Docusaurus documentation at this link: https://docusaurus.io/

In my case, I added the documentation to a subdomain docs.aitmpl.com, but you can also leave it on a route like /docs. Whatever you prefer.

Now Docusaurus-Expert Agent, Do Your Job!
Start by adding the agent with this command:

npx claude-code-templates@latest --agent=documentation/docusaurus-expert --yes
You can see more details about the agent at this link: https://www.aitmpl.com/component/agent/docusaurus-expert

Press enter or click to view image in full size

Ask Claude Code to use this agent to clean up all the default Docusaurus files in that directory and create a plan to add your project’s documentation.

After adding new features, simply prompt:

"use docusuarus-expert agent to clean up all default Docusaurus files in 
  @docs/ and generate a plan for adding my project documentation"
Press enter or click to view image in full size

The agent analyzes your Git staged changes, identifies what needs documentation updates, and modifies the appropriate Markdown files automatically.


CI/CD Integration
This workflow integrates seamlessly with automated deployment. Here’s how to set up continuous documentation updates:

1. Install Claude GitHub App (Quick Method):

# In your Claude Code terminal
/install-github-app
Press enter or click to view image in full size

Authenticate with your GitHub account and then install the Claude app. You can authorize all your repositories or only the ones where you want to run your pipelines with Claude Code.

Press enter or click to view image in full size

Once the app is installed and authorized on GitHub, return to the console to complete the installation.

Claude Code will ask if you want to install it for PR reviews or to tag it on GitHub with @claude. Select what you want for these features.

Create a Specific Documentation Workflow:
This pipeline reviews changes on specific branches and when it detects modifications, it will use the Docusaurus-Expert Agent. Claude Code uses this agent’s context to review changes and sends a PR with the documentation it determines should be added to Docusaurus. The pipeline is generic, so customize it with your specifications for better results.

Step-by-Step Pipeline Breakdown
Step 1: Trigger Configuration
The workflow triggers on pull requests to catch documentation needs before merging to main.

Critical: You must exclude your Docusaurus documentation folder to prevent infinite loops where Claude Code continuously creates new PRs updating documentation.

on:
  pull_request:
    branches:
      - main  # CUSTOMIZE: Change to your default branch
    paths:
      # CUSTOMIZE: Add file types that should trigger documentation updates
      - '**.js'
      - '**.ts'
      - '**.jsx'
      - '**.tsx'
      - '**.py'
      - '**.java'
      # CUSTOMIZE: Add more file extensions as needed
      
      # CUSTOMIZE: Exclude paths that shouldn't trigger documentation
      - '!.github/**'
      - '!**/node_modules/**'
      - '!**/dist/**'
      - '!**/build/**'
      - '!docs/**'  # CRITICAL: Replace 'docs' with your Docusaurus folder path
                    # This prevents infinite loops - without this exclusion,
                    # Claude Code will create endless PRs updating documentation
                    # Common paths: !docu/**, !documentation/**, !website/docs/**
Set up the runner with proper permissions and install the documentation agent.

jobs:
  auto-document:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write  # Required for claude-code-action
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history needed for proper diff
     - name: Setup Claude configuration
        run: |
          mkdir -p .claude/agents
          # Install agent if not exists
          if [ ! -f ".claude/agents/docusaurus-expert.md" ]; then
            npx claude-code-templates@latest \
              --agent documentation/docusaurus-expert \
              --yes \
              --directory .
          fi
Step 3: Change Detection
Identify files changed in the pull request for context.

- name: Get changed files
  id: changed
  run: |
    # Fetch the base branch
    git fetch origin ${{ github.event.pull_request.base.ref }}:${{ github.event.pull_request.base.ref }}
    
    # Get changed files and save to output
    CHANGED_FILES=$(git diff --name-only ${{ github.event.pull_request.base.ref }}...HEAD | tr '\n' ' ')
    echo "files=$CHANGED_FILES" >> $GITHUB_OUTPUT
Step 4: Documentation Update
Execute the agent with project-specific context and requirements.

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
      # CUSTOMIZE: Update these rules for your project
      - Documentation language: English
      - Code examples should include TypeScript types where applicable
      - Follow existing documentation structure and style
      - Update getting-started.md for new features
      - Create feature-specific documentation files when appropriate
      
      ## Current App Context
      # CUSTOMIZE: Replace with your project's context
      This is a React Todo App with features like:
      - Todo creation, editing, deletion with character limits
      - Priority system (high/medium/low with color indicators)  
      - Share functionality to X/Twitter (individual and bulk)
      - Responsive design for mobile/tablet/desktop
      - Dark/light theme toggle
      - Creation date display for todos
      - Task completion tracking and statistics
      - Todo count badge in app title
      
      Focus on documenting the changes found in the modified files above.
    # CUSTOMIZE: Adjust max turns and other settings as needed
    claude_args: "--max-turns 15 --dangerously-skip-permissions"
Step 5: Pull Request Creation
Create a separate pull request with documentation updates.

- name: Create Pull Request
  uses: peter-evans/create-pull-request@v6
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    commit-message: "docs: update via docusaurus-expert agent"
    title: "📚 Documentation Update"  # CUSTOMIZE: Change title format
    body: |
      Automated documentation update based on pull request changes.
      **Changed files:**
      ```
      ${{ steps.changed.outputs.files }}
      ```
    branch: docs/auto-${{ github.sha }}
    base: main  # CUSTOMIZE: Match your default branch
    # CUSTOMIZE: Add your team or specific reviewers
    # team-reviewers: documentation-team
Complete Pipeline Configuration
I’m sharing my complete pipeline — you should customize it to fit your needs.

# .github/workflows/docusaurus-auto-docs.yml
name: Docusaurus Documentation Automation

on:
  pull_request:
    branches:
      - main
    paths:
      # CUSTOMIZE: Add paths that should trigger documentation updates
      - '**.js'
      - '**.ts'
      - '**.jsx'
      - '**.tsx'
      - '**.py'
      - '**.java'
      # CUSTOMIZE: Exclude paths
      - '!.github/**'
      - '!**/node_modules/**'
      - '!**/dist/**'
      - '!**/build/**'
      - '!docs/**'

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
          fetch-depth: 0

      # Ensure .claude directory exists
      - name: Setup Claude configuration
        run: |
          mkdir -p .claude/agents
          # Install agent if not exists
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
      # Execute with agent
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
          # CUSTOMIZE: Adjust settings
          claude_args: "--max-turns 15 --dangerously-skip-permissions"

      # Create PR with documentation updates
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "docs: update via docusaurus-expert agent"
          title: "📚 Documentation Update"
          body: |
            Automated documentation update based on pull request changes.
            **Changed files:**
            ```
            ${{ steps.changed.outputs.files }}
            ```
          branch: docs/auto-${{ github.sha }}
          base: main
          # CUSTOMIZE: Set your team or specific reviewers
          # team-reviewers: documentation-team
Configure GitHub
You need to add the Anthropic API Key as a secret variable in the repository where you’ll run the pipeline. Go to Settings, then Secrets and Variables, then Actions:


Add your Anthropic API Key (https://console.anthropic.com/)

Press enter or click to view image in full size

Make sure to enable PR creation in the Repository: go to Settings → Actions → General → Workflow permissions

Options you need:

Read repository contents and packages permissions
Allow GitHub Actions to create and approve pull requests
Press enter or click to view image in full size

All set! Now every time you make a change to the selected branch in the GitHub workflow, the “auto-document” Action will execute.

Press enter or click to view image in full size

If you open the logs, you’ll be able to see how the agent’s prompt was added to the Claude Code installation and how it delivers the changes made in the PR as context.

Press enter or click to view image in full size

Once the GitHub Action execution is complete, you’ll see a new PR created by Claude Code “📚Documentation Update” where you can view all the changes suggested by the Claude Code agent in the Docusaurus documentation.

Press enter or click to view image in full size

Accept the PR if you think it did a good job and you’re done!

You now have an automatic documentation website with Claude Code + Docusaurus Expert Agent and GitHub Actions.