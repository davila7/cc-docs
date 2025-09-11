# MCP Integration

You can integrate MCP servers into your project by creating a `.mcp.json` file in the root directory of your project. This file contains a list of MCP servers that are available to Claude Code.

Here is an example of a `.mcp.json` file:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-example"],
      "env": {"API_KEY": "your-key"}
    }
  }
}
```

For more information, see the [MCP documentation](../../chapter-2-core-concepts-and-common-workflows/6-mcp.md).