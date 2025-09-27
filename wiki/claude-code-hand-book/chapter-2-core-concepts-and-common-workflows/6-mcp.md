# Connect Claude Code to tools via MCP

> Learn how to connect Claude Code to your tools with the Model Context Protocol.

Claude Code can connect to hundreds of external tools and data sources through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction), an open-source standard for AI-tool integrations. MCP servers give Claude Code access to your tools, databases, and APIs.

## What you can do with MCP

With MCP servers connected, you can ask Claude Code to:

* **Implement features from issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."
* **Analyze monitoring data**: "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."
* **Query databases**: "Find emails of 10 random users who used feature ENG-4521, based on our Postgres database."
* **Integrate designs**: "Update our standard email template based on the new Figma designs that were posted in Slack"
* **Automate workflows**: "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."

## Popular MCP servers

Here are some commonly used MCP servers you can connect to Claude Code:

<Warning>
  Use third party MCP servers at your own risk - Anthropic has not verified
  the correctness or security of all these servers.
  Make sure you trust MCP servers you are installing.
  Be especially careful when using MCP servers that could fetch untrusted
  content, as these can expose you to prompt injection risk.
</Warning>

## Installing MCP servers

MCP servers can be configured in three different ways depending on your needs:

### Option 1: Add a local stdio server

Stdio servers run as local processes on your machine. They're ideal for tools that need direct system access or custom scripts.

```bash
# Basic syntax
claude mcp add <name> <command> [args...]

# Real example: Add Airtable server
claude mcp add airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

<Note>
  **Understanding the "--" parameter:**
  The `--` (double dash) separates Claude's own CLI flags from the command and arguments that get passed to the MCP server. Everything before `--` are options for Claude (like `--env`, `--scope`), and everything after `--` is the actual command to run the MCP server.

  For example:

  * `claude mcp add myserver -- npx server` → runs `npx server`
  * `claude mcp add myserver --env KEY=value -- python server.py --port 8080` → runs `python server.py --port 8080` with `KEY=value` in environment

  This prevents conflicts between Claude's flags and the server's flags.
</Note>

### Option 2: Add a remote SSE server

SSE (Server-Sent Events) servers provide real-time streaming connections. Many cloud services use this for live updates.

```bash
# Basic syntax
claude mcp add --transport sse <name> <url>

# Real example: Connect to Linear
claude mcp add --transport sse linear https://mcp.linear.app/sse

# Example with authentication header
claude mcp add --transport sse private-api https://api.company.com/mcp \
  --header "X-API-Key: your-key-here"
```

### Option 3: Add a remote HTTP server

HTTP servers use standard request/response patterns. Most REST APIs and web services use this transport.

```bash
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Managing your servers

Once configured, you can manage your MCP servers with these commands:

```bash
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# (within Claude Code) Check server status
/mcp
```

<Tip>
  Tips:

  * Use the `--scope` flag to specify where the configuration is stored:
    * `local` (default): Available only to you in the current project (was called `project` in older versions)
    * `project`: Shared with everyone in the project via `.mcp.json` file
    * `user`: Available to you across all projects (was called `global` in older versions)
  * Set environment variables with `--env` flags (e.g., `--env KEY=value`)
  * Configure MCP server startup timeout using the MCP\_TIMEOUT environment variable (e.g., `MCP_TIMEOUT=10000 claude` sets a 10-second timeout)
  * Claude Code will display a warning when MCP tool output exceeds 10,000 tokens. To increase this limit, set the `MAX_MCP_OUTPUT_TOKENS` environment variable (e.g., `MAX_MCP_OUTPUT_TOKENS=50000`)
  * Use `/mcp` to authenticate with remote servers that require OAuth 2.0 authentication
</Tip>

<Warning>
  **Windows Users**: On native Windows (not WSL), local MCP servers that use `npx` require the `cmd /c` wrapper to ensure proper execution.

  ```bash
  # This creates command="cmd" which Windows can execute
  claude mcp add my-server -- cmd /c npx -y @some/package
  ```

  Without the `cmd /c` wrapper, you'll encounter "Connection closed" errors because Windows cannot directly execute `npx`. (See the note above for an explanation of the `--` parameter.)
</Warning>

## MCP installation scopes

MCP servers can be configured at three different scope levels, each serving distinct purposes for managing server accessibility and sharing. Understanding these scopes helps you determine the best way to configure servers for your specific needs.

### Local scope

Local-scoped servers represent the default configuration level and are stored in your project-specific user settings. These servers remain private to you and are only accessible when working within the current project directory. This scope is ideal for personal development servers, experimental configurations, or servers containing sensitive credentials that shouldn't be shared.

```bash
# Add a local-scoped server (default)
claude mcp add my-private-server /path/to/server

# Explicitly specify local scope
claude mcp add my-private-server --scope local /path/to/server
```

### Project scope

Project-scoped servers enable team collaboration by storing configurations in a `.mcp.json` file at your project's root directory. This file is designed to be checked into version control, ensuring all team members have access to the same MCP tools and services. When you add a project-scoped server, Claude Code automatically creates or updates this file with the appropriate configuration structure.

```bash
# Add a project-scoped server
claude mcp add shared-server --scope project /path/to/server
```

The resulting `.mcp.json` file follows a standardized format:

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

For security reasons, Claude Code prompts for approval before using project-scoped servers from `.mcp.json` files. If you need to reset these approval choices, use the `claude mcp reset-project-choices` command.

### User scope

User-scoped servers provide cross-project accessibility, making them available across all projects on your machine while remaining private to your user account. This scope works well for personal utility servers, development tools, or services you frequently use across different projects.

```bash
# Add a user server
claude mcp add my-user-server --scope user /path/to/server
```

### Choosing the right scope

Select your scope based on:

* **Local scope**: Personal servers, experimental configurations, or sensitive credentials specific to one project
* **Project scope**: Team-shared servers, project-specific tools, or services required for collaboration
* **User scope**: Personal utilities needed across multiple projects, development tools, or frequently-used services

### Scope hierarchy and precedence

MCP server configurations follow a clear precedence hierarchy. When servers with the same name exist at multiple scopes, the system resolves conflicts by prioritizing local-scoped servers first, followed by project-scoped servers, and finally user-scoped servers. This design ensures that personal configurations can override shared ones when needed.

### Environment variable expansion in `.mcp.json`

Claude Code supports environment variable expansion in `.mcp.json` files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys.

**Supported syntax:**

* `${VAR}` - Expands to the value of environment variable `VAR`
* `${VAR:-default}` - Expands to `VAR` if set, otherwise uses `default`

**Expansion locations:**
Environment variables can be expanded in:

* `command` - The server executable path
* `args` - Command-line arguments
* `env` - Environment variables passed to the server
* `url` - For SSE/HTTP server types
* `headers` - For SSE/HTTP server authentication

**Example with variable expansion:**

```json
{
  "mcpServers": {
    "api-server": {
      "type": "sse",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

If a required environment variable is not set and has no default value, Claude Code will fail to parse the config.

## Practical examples


### Example: Monitor errors with Sentry

```bash
# 1. Add the Sentry MCP server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Use /mcp to authenticate with your Sentry account
> /mcp

# 3. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```


## Authenticate with remote MCP servers

Many cloud-based MCP servers require authentication. Claude Code supports OAuth 2.0 for secure connections.

<Steps>
  <Step title="Add the server that requires authentication">
    For example:

    ```bash
    claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
    ```
  </Step>

  <Step title="Use the /mcp command within Claude Code">
    In Claude code, use the command:

    ```
    > /mcp
    ```

    Then follow the steps in your browser to login.
  </Step>
</Steps>

<Tip>
  Tips:

  * Authentication tokens are stored securely and refreshed automatically
  * Use "Clear authentication" in the `/mcp` menu to revoke access
  * If your browser doesn't open automatically, copy the provided URL
  * OAuth authentication works with both SSE and HTTP transports
</Tip>

## Add MCP servers from JSON configuration

If you have a JSON configuration for an MCP server, you can add it directly:

<Steps>
  <Step title="Add an MCP server from JSON">
    ```bash
    # Basic syntax
    claude mcp add-json <name> '<json>'

    # Example: Adding a stdio server with JSON configuration
    claude mcp add-json weather-api '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
    ```
  </Step>

  <Step title="Verify the server was added">
    ```bash
    claude mcp get weather-api
    ```
  </Step>
</Steps>

<Tip>
  Tips:

  * Make sure the JSON is properly escaped in your shell
  * The JSON must conform to the MCP server configuration schema
  * You can use `--scope user` to add the server to your user configuration instead of the project-specific one
</Tip>

## Import MCP servers from Claude Desktop

If you've already configured MCP servers in Claude Desktop, you can import them:

<Steps>
  <Step title="Import servers from Claude Desktop">
    ```bash
    # Basic syntax 
    claude mcp add-from-claude-desktop 
    ```
  </Step>

  <Step title="Select which servers to import">
    After running the command, you'll see an interactive dialog that allows you to select which servers you want to import.
  </Step>

  <Step title="Verify the servers were imported">
    ```bash
    claude mcp list 
    ```
  </Step>
</Steps>

<Tip>
  Tips:

  * This feature only works on macOS and Windows Subsystem for Linux (WSL)
  * It reads the Claude Desktop configuration file from its standard location on those platforms
  * Use the `--scope user` flag to add servers to your user configuration
  * Imported servers will have the same names as in Claude Desktop
  * If servers with the same names already exist, they will get a numerical suffix (e.g., `server_1`)
</Tip>

## Use Claude Code as an MCP server

You can use Claude Code itself as an MCP server that other applications can connect to:

```bash
# Start Claude as a stdio MCP server
claude mcp serve
```

You can use this in Claude Desktop by adding this configuration to claude\_desktop\_config.json:

```json
{
  "mcpServers": {
    "claude-code": {
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

<Tip>
  Tips:

  * The server provides access to Claude's tools like View, Edit, LS, etc.
  * In Claude Desktop, try asking Claude to read files in a directory, make edits, and more.
  * Note that this MCP server is simply exposing Claude Code's tools to your MCP client, so your own client is responsible for implementing user confirmation for individual tool calls.
</Tip>

## MCP output limits and warnings

When MCP tools produce large outputs, Claude Code helps manage the token usage to prevent overwhelming your conversation context:

* **Output warning threshold**: Claude Code displays a warning when any MCP tool output exceeds 10,000 tokens
* **Configurable limit**: You can adjust the maximum allowed MCP output tokens using the `MAX_MCP_OUTPUT_TOKENS` environment variable
* **Default limit**: The default maximum is 25,000 tokens

To increase the limit for tools that produce large outputs:

```bash
# Set a higher limit for MCP tool outputs
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

This is particularly useful when working with MCP servers that:

* Query large datasets or databases
* Generate detailed reports or documentation
* Process extensive log files or debugging information

<Warning>
  If you frequently encounter output warnings with specific MCP servers, consider increasing the limit or configuring the server to paginate or filter its responses.
</Warning>

## Use MCP resources

MCP servers can expose resources that you can reference using @ mentions, similar to how you reference files.

### Reference MCP resources

<Steps>
  <Step title="List available resources">
    Type `@` in your prompt to see available resources from all connected MCP servers. Resources appear alongside files in the autocomplete menu.
  </Step>

  <Step title="Reference a specific resource">
    Use the format `@server:protocol://resource/path` to reference a resource:

    ```
    > Can you analyze @github:issue://123 and suggest a fix?
    ```

    ```
    > Please review the API documentation at @docs:file://api/authentication
    ```
  </Step>

  <Step title="Multiple resource references">
    You can reference multiple resources in a single prompt:

    ```
    > Compare @postgres:schema://users with @docs:file://database/user-model
    ```
  </Step>
</Steps>

<Tip>
  Tips:

  * Resources are automatically fetched and included as attachments when referenced
  * Resource paths are fuzzy-searchable in the @ mention autocomplete
  * Claude Code automatically provides tools to list and read MCP resources when servers support them
  * Resources can contain any type of content that the MCP server provides (text, JSON, structured data, etc.)
</Tip>

## Use MCP prompts as slash commands

MCP servers can expose prompts that become available as slash commands in Claude Code.

### Execute MCP prompts

<Steps>
  <Step title="Discover available prompts">
    Type `/` to see all available commands, including those from MCP servers. MCP prompts appear with the format `/mcp__servername__promptname`.
  </Step>

  <Step title="Execute a prompt without arguments">
    ```
    > /mcp__github__list_prs
    ```
  </Step>

  <Step title="Execute a prompt with arguments">
    Many prompts accept arguments. Pass them space-separated after the command:

    ```
    > /mcp__github__pr_review 456
    ```

    ```
    > /mcp__jira__create_issue "Bug in login flow" high
    ```
  </Step>
</Steps>

<Tip>
  Tips:

  * MCP prompts are dynamically discovered from connected servers
  * Arguments are parsed based on the prompt's defined parameters
  * Prompt results are injected directly into the conversation
  * Server and prompt names are normalized (spaces become underscores)
</Tip>