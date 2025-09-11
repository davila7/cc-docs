# Authentication

> Learn how to configure user authentication, authorization, and access controls for Claude Code in your organization.

## Authentication methods

Setting up Claude Code requires access to Anthropic models. For teams, you can set up Claude Code access in one of three ways:

* Anthropic API via the Anthropic Console
* Amazon Bedrock
* Google Vertex AI

### Anthropic API authentication

**To set up Claude Code access for your team via Anthropic API:**

1. Use your existing Anthropic Console account or create a new Anthropic Console account
2. You can add users through either method below:
   * Bulk invite users from within the Console (Console -> Settings -> Members -> Invite)
   * [Set up SSO](https://support.anthropic.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
3. When inviting users, they need one of the following roles:
   * "Claude Code" role means users can only create Claude Code API keys
   * "Developer" role means users can create any kind of API key
4. Each invited user needs to complete these steps:
   * Accept the Console invite
   * [Check system requirements](2-installation-and-setup.md#system-requirements)
   * [Install Claude Code](2-installation-and-setup.md#installation)
   * Login with Console account credentials

### Cloud provider authentication

**To set up Claude Code access for your team via Bedrock or Vertex:**

1. Follow the [Bedrock docs](../../chapter-3-advanced-features-and-sdk/8-deployment.md#amazon-bedrock) or [Vertex docs](../../chapter-3-advanced-features-and-sdk/8-deployment.md#google-vertex-ai)
2. Distribute the environment variables and instructions for generating cloud credentials to your users. Read more about how to [manage configuration here](5-basic-configuration.md).
3. Users can [install Claude Code](2-installation-and-setup.md#installation)

> **Author's Recommendation:**
>
> I recommend using a password manager to store your credentials securely. This will help you avoid accidentally checking your credentials into source control.

## Credential management

Claude Code securely manages your authentication credentials:

* **Storage location**: On macOS, API keys, OAuth tokens, and other credentials are stored in the encrypted macOS Keychain.
* **Supported authentication types**: Claude.ai credentials, Anthropic API credentials, Bedrock Auth, and Vertex Auth.
* **Custom credential scripts**: The [`apiKeyHelper`](5-basic-configuration.md#available-settings) setting can be configured to run a shell script that returns an API key.
* **Refresh intervals**: By default, `apiKeyHelper` is called after 5 minutes or on HTTP 401 response. Set `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` environment variable for custom refresh intervals.