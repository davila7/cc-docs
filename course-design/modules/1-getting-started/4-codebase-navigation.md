# Codebase Navigation

One of Claude Code's most powerful features is the ability to navigate and understand any codebase through natural language queries. No more manually searching through files or reading extensive documentation!

## How Claude Code Navigates Your Code

Claude Code automatically:
- **Reads files** as needed for context
- **Understands project structure** by analyzing directories
- **Follows relationships** between files and components
- **Indexes code patterns** to answer specific questions

**You don't need to manually add context** - just ask!

## Basic Navigation Queries

### Understanding Project Structure

Ask high-level questions to understand the overall architecture:

```bash
> what does this project do?
> explain the folder structure
> what technologies and frameworks are used here?
> where is the main entry point?
> what's the purpose of each directory?
```

**Example Response:**

```
This is a Node.js web application built with Express.js. The project structure:

- `/src` - Source code
  - `/routes` - API endpoints
  - `/models` - Database models (MongoDB with Mongoose)
  - `/controllers` - Business logic
  - `/middleware` - Custom middleware
- `/tests` - Jest test files
- `/public` - Static assets
- `/config` - Configuration files

Main entry point: src/index.js
```

### Finding Specific Files

Locate files by describing what you're looking for:

```bash
> where is the user authentication logic?
> which file contains the database connection setup?
> find the configuration file for the API
> where are the user models defined?
> show me the file that handles email sending
```

### Understanding Code Functionality

Ask about specific features or functions:

```bash
> what does the authenticate() function do?
> how does user registration work in this app?
> explain the payment processing flow
> what endpoints does the API expose?
> how is error handling implemented?
```

## Advanced Navigation Queries

### Finding Dependencies and Relationships

```bash
> what files import the User model?
> which components depend on the AuthService?
> show me all files that use the database connection
> what functions call the sendEmail utility?
> trace the flow from login endpoint to database
```

### Analyzing Code Patterns

```bash
> what design patterns are used in this project?
> how is state management handled?
> what's the authentication strategy?
> how are API errors handled globally?
> what testing strategy does this project use?
```

### Getting Statistics

```bash
> how many API endpoints are there?
> what percentage of the code has tests?
> how many external dependencies does this project have?
> which files are the largest?
> what's the total lines of code?
```

## Effective Navigation Strategies

### 1. Start Broad, Then Narrow

```bash
# Step 1: Understand the big picture
> what does this project do?

# Step 2: Identify key areas
> what are the main modules or components?

# Step 3: Dive into specifics
> show me how user authentication works

# Step 4: Find exact implementations
> where is the login validation logic?
```

### 2. Use Progressive Queries

```bash
> where is the API defined?
[Claude shows you /src/routes/api.js]

> what routes are in that file?
[Claude lists all routes]

> show me the implementation of the /users route
[Claude displays the specific code]

> what middleware does that route use?
[Claude explains the middleware chain]
```

### 3. Ask for Context

```bash
> explain the relationship between User and Order models
> how do the frontend and backend communicate?
> what happens when a user clicks the submit button?
> trace the data flow for user registration
```

## Navigation by Task Type

### Debugging

```bash
> where could this error be coming from: "Cannot read property 'name' of undefined"?
> find all places where we access user.profile.email
> show me error handling in the payment module
> where are exceptions caught in the authentication flow?
```

### Adding Features

```bash
> where should I add a new API endpoint for products?
> which file should contain user profile update logic?
> where does the current search functionality live?
> what's the pattern for adding new database models?
```

### Refactoring

```bash
> what files would be affected if I change the User model?
> which components use the old API format?
> where is duplicated code between UserService and AdminService?
> what functions are longer than 50 lines?
```

### Code Review

```bash
> are there any security issues in the authentication code?
> what files are missing error handling?
> where are environment variables used without validation?
> show me functions with high complexity
```

## Working with Different Project Types

### Web Applications

```bash
> where are the React components?
> how is routing configured?
> what state management library is used?
> where are API calls made?
```

### APIs/Backend Services

```bash
> list all API endpoints
> where is the database schema defined?
> how is authentication middleware configured?
> what's the error response format?
```

### Libraries/Packages

```bash
> what's the public API of this library?
> where are the exported functions?
> how are types/interfaces defined?
> what examples are available?
```

### Microservices

```bash
> what services make up this system?
> how do services communicate?
> where is the service discovery configured?
> what's the deployment structure?
```

## Practice Exercises

### Exercise 1: Explore a New Codebase

Use these queries on an unfamiliar project:

1. `what does this project do?`
2. `what technologies are used?`
3. `where is the main entry point?`
4. `what's the folder structure?`
5. `how many files are in this project?`

### Exercise 2: Deep Dive

Pick a feature and fully understand it:

1. `where is [feature] implemented?`
2. `explain how [feature] works`
3. `what files are involved in [feature]?`
4. `what dependencies does [feature] have?`
5. `are there tests for [feature]?`

### Exercise 3: Relationship Mapping

Understand code relationships:

1. `what files import [filename]?`
2. `what does [filename] depend on?`
3. `trace the flow from [start] to [end]`
4. `how do [component A] and [component B] interact?`

## Best Practices

### ✅ Do's

1. **Be specific when possible**
   ```bash
   ✅ "where is the email validation function?"
   ❌ "find validation"
   ```

2. **Ask about relationships**
   ```bash
   ✅ "how does UserController interact with UserService?"
   ❌ "show UserController"
   ```

3. **Request explanations**
   ```bash
   ✅ "explain how authentication works"
   ❌ "show auth code"
   ```

4. **Use follow-up questions**
   ```bash
   > where is the login function?
   > what does that function do?
   > what could cause it to fail?
   ```

### ❌ Don'ts

1. **Don't memorize file paths**
   - Let Claude Code find them for you

2. **Don't manually grep or search**
   - Use natural language instead

3. **Don't assume structure**
   - Ask Claude Code to explore and explain

## Understanding Claude's Responses

### File References

Claude Code often shows file paths with line numbers:

```
The login function is in src/auth/login.js:45
```

You can ask follow-up questions about specific files:

```bash
> show me that function
> what does line 50 do?
> are there any issues with that implementation?
```

### Code Explanations

When Claude explains code, it provides:
- **Purpose:** What the code does
- **How it works:** Implementation details
- **Context:** Where it fits in the system
- **Dependencies:** What it relies on

### Navigation Limits

Claude Code is excellent at navigation, but:
- Very large files may be sampled
- Binary files can't be read
- Some generated files might be skipped
- Respect `.gitignore` and `.claudeignore`

## Keyboard Shortcuts for Navigation

While Claude Code uses natural language, knowing these helps:

| Shortcut | Action |
|----------|--------|
| `↑` | Previous command |
| `↓` | Next command |
| `Tab` | Command completion |
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit session |

## Next Steps

Now that you can navigate effectively, learn to [Make Your First Code Modifications](./5-first-modifications.md).

## Additional Resources

- [Common Workflows](https://docs.anthropic.com/claude/docs/common-workflows)
- [Interactive Mode](https://docs.anthropic.com/claude/docs/interactive-mode)
- Project-specific navigation tips in your project README
