# Claude Code overview

> Learn about Claude Code, Anthropic's agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.

## Get started in 30 seconds

Prerequisites:

* [Node.js 18 or newer](https://nodejs.org/en/download/)
* A [Claude.ai](https://claude.ai) (recommended) or [Anthropic Console](https://console.anthropic.com/) account

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Navigate to your project
cd your-awesome-project

# Start coding with Claude
claude
# You'll be prompted to log in on first use
```

That's it! You're ready to start coding with Claude. [Continue with Quickstart (5 mins) →](3-quickstart.md)

(Got specific setup needs or hit issues? See [advanced setup](2-installation-and-setup.md) or [troubleshooting](../../chapter-3-advanced-features-and-sdk/10-troubleshooting.md).)

> **Author's Recommendation:**
>
> The `.claude` directory is where all the magic happens. It contains your settings, memory, and other configuration files. I recommend you take a look at the files in this directory to get a better understanding of how Claude Code works.

## What Claude Code does for you

* **Build features from descriptions**: Tell Claude what you want to build in plain English. It will make a plan, write the code, and ensure it works.
* **Debug and fix issues**: Describe a bug or paste an error message. Claude Code will analyze your codebase, identify the problem, and implement a fix.
* **Navigate any codebase**: Ask anything about your team's codebase, and get a thoughtful answer back. Claude Code maintains awareness of your entire project structure, can find up-to-date information from the web, and with [MCP](../../chapter-2-core-concepts-and-common-workflows/6-mcp.md) can pull from external datasources like Google Drive, Figma, and Slack.
* **Automate tedious tasks**: Fix fiddly lint issues, resolve merge conflicts, and write release notes. Do all this in a single command from your developer machines, or automatically in CI.

## Why developers love Claude Code

* **Works in your terminal**: Not another chat window. Not another IDE. Claude Code meets you where you already work, with the tools you already love.
* **Takes action**: Claude Code can directly edit files, run commands, and create commits. Need more? [MCP](../../chapter-2-core-concepts-and-common-workflows/6-mcp.md) lets Claude read your design docs in Google Drive, update your tickets in Jira, or use *your* custom developer tooling.
* **Unix philosophy**: Claude Code is composable and scriptable. `tail -f app.log | claude -p "Slack me if you see any anomalies appear in this log stream"` *works*. Your CI can run `claude -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"`.
* **Enterprise-ready**: Use Anthropic's API, or host on AWS or GCP. Enterprise-grade [security](../../chapter-3-advanced-features-and-sdk/9-administration.md#security), [privacy](../../chapter-3-advanced-features-and-sdk/9-administration.md#data-usage), and [compliance](https://trust.anthropic.com/) is built-in.

## Next steps

* [Quickstart](3-quickstart.md)
* [Common workflows](../../chapter-2-core-concepts-and-common-workflows/3-common-workflows.md)
* [Troubleshooting](../../chapter-3-advanced-features-and-sdk/10-troubleshooting.md)
* [IDE setup](5-basic-configuration.md#ide-integration)

## Additional resources

* [Host on AWS or GCP](../../chapter-3-advanced-features-and-sdk/8-deployment.md)
* [Settings](5-basic-configuration.md)
* [Commands](6-cli-reference.md)
* [Reference implementation](https://github.com/anthropics/claude-code/tree/main/.devcontainer)
* [Security](../../chapter-3-advanced-features-and-sdk/9-administration.md#security)
* [Privacy and data usage](../../chapter-3-advanced-features-and-sdk/9-administration.md#data-usage)