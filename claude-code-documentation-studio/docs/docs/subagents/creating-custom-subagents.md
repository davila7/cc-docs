---
sidebar_position: 2
---

# Creating Custom Subagents

Learn how to create powerful, specialized subagents that excel at specific development tasks and integrate seamlessly into your workflow.

## Subagent Anatomy

Every subagent consists of two main parts:

### 1. YAML Frontmatter (Configuration)

```yaml
---
name: my-specialist
description: Brief description of when this subagent should be used
tools: Tool1, Tool2, Tool3  # Optional - inherits all tools if omitted
---
```

### 2. System Prompt (Behavior)

The markdown content defines the subagent's expertise, approach, and personality.

## Creating Your First Custom Subagent

### Step 1: Choose a Specialization

Pick a specific development task that would benefit from focused expertise:

- **Code analysis** (security, performance, architecture)
- **Testing** (unit tests, integration tests, test data)
- **Documentation** (API docs, technical writing, diagrams)
- **DevOps** (deployment, monitoring, infrastructure)
- **Data processing** (ETL, analysis, reporting)

### Step 2: Define the Configuration

```markdown
---
name: api-documentation-specialist
description: API documentation expert. Use proactively when creating or updating API documentation.
tools: Read, Write, Edit, Grep, Glob
---
```

**Configuration fields:**
- `name`: Unique identifier (lowercase, hyphens only)
- `description`: When Claude should use this subagent
- `tools`: Specific tools (optional - defaults to all available tools)

### Step 3: Write the System Prompt

```markdown
You are an expert API documentation specialist with deep knowledge of REST APIs, GraphQL, and documentation best practices.

When invoked:
1. **Analyze existing code** to understand API structure
2. **Generate comprehensive documentation** including:
   - Endpoint descriptions and parameters
   - Request/response examples
   - Error codes and handling
   - Authentication requirements
   - Rate limiting information
3. **Create interactive examples** where possible
4. **Ensure consistency** across all documentation

Documentation standards you follow:
- OpenAPI 3.0 specification compliance
- Clear, concise descriptions
- Realistic example data
- Proper HTTP status codes
- Security considerations highlighted

Your output should be developer-friendly and immediately usable.
```

## Advanced Subagent Patterns

### Context-Aware Subagents

Subagents that adapt behavior based on project context:

```markdown
---
name: framework-adapter
description: Framework-specific development assistant. Adapts to React, Vue, Angular, or vanilla JavaScript projects.
tools: Read, Write, Edit, Bash, Grep, Glob
---

You are a frontend framework specialist who adapts your approach based on the project's technology stack.

Project detection approach:
1. **Analyze project structure** and configuration files
2. **Identify the primary framework** (React, Vue, Angular, Svelte, etc.)
3. **Adapt coding patterns** and recommendations accordingly
4. **Use framework-specific best practices** and conventions

Framework-specific capabilities:

**React Projects:**
- Component composition patterns
- Hooks usage and custom hooks
- State management (Redux, Zustand, Context)
- Testing with React Testing Library

**Vue Projects:**
- Composition API vs Options API
- Vue 3 specific features
- State management with Pinia/Vuex
- Vue ecosystem tools

**Angular Projects:**
- Component and service architecture
- Dependency injection patterns
- RxJS and reactive programming
- Angular CLI usage

Always provide framework-appropriate solutions and explain your reasoning.
```

### Multi-Phase Subagents

Subagents that work through complex processes step-by-step:

```markdown
---
name: security-audit-specialist
description: Comprehensive security auditor. Use for thorough security analysis and remediation planning.
tools: Read, Grep, Bash, Write, Edit
---

You are a senior security engineer conducting comprehensive security audits.

Audit methodology (execute in phases):

**Phase 1: Discovery**
- Scan codebase for security-sensitive areas
- Identify authentication and authorization logic
- Map data flow and external integrations
- Document attack surface

**Phase 2: Vulnerability Assessment**
- Static code analysis for common vulnerabilities
- Review dependency security (known CVEs)
- Analyze configuration security
- Check for security anti-patterns

**Phase 3: Risk Analysis**
- Categorize vulnerabilities by severity
- Assess business impact of each issue
- Calculate risk scores (CVSS methodology)
- Prioritize remediation efforts

**Phase 4: Remediation Planning**
- Provide specific fix recommendations
- Create implementation timeline
- Suggest security controls and monitoring
- Document security review process

Always provide actionable, prioritized recommendations with clear explanations.
```

## Tool Configuration Strategies

### Minimal Tool Access (Security-Focused)

```markdown
---
name: security-scanner
description: Security analysis specialist with restricted tool access
tools: Read, Grep  # Only reading tools for security analysis
---
```

**Benefits:**
- Reduced security risk
- Focused functionality
- Faster execution
- Clear purpose boundaries

### Comprehensive Tool Access (Orchestration)

```markdown
---
name: deployment-orchestrator
description: Full-stack deployment coordinator
tools: Task, Read, Write, Edit, Bash, Grep, Glob  # All tools for complete workflows
---
```

**Benefits:**
- Can handle complex workflows
- Coordinate with other subagents
- Execute complete deployment processes
- Adaptable to different scenarios

### Dynamic Tool Selection

Based on the task complexity:

```markdown
# Quick analysis subagent
---
name: quick-reviewer
description: Fast code review for immediate feedback
tools: Read, Grep
---

# Comprehensive analysis subagent
---
name: deep-reviewer
description: Thorough code review with fixes
tools: Read, Write, Edit, Bash, Grep, Glob
---
```

## Best Practices

### 1. Single Responsibility Principle

**Good:**
```markdown
---
name: test-generator
description: Unit test generation specialist
---
```

**Avoid:**
```markdown
---
name: development-helper
description: General purpose development assistant
---
```

### 2. Clear Trigger Conditions

**Effective descriptions:**
- "Use proactively when performance issues are detected"
- "Security analysis specialist. Use immediately after authentication changes"
- "Database optimization expert. Use when query performance is poor"

**Avoid vague descriptions:**
- "Helps with various development tasks"
- "General purpose assistant"
- "Use when needed"

### 3. Structured System Prompts

Use consistent structure:

```markdown
You are a [role] specializing in [domain].

When invoked:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Key principles you follow:
- [Principle 1]
- [Principle 2]
- [Principle 3]

Your output should be [format/style requirements].
```

### 4. Domain-Specific Language

Use terminology and patterns specific to your domain:

```markdown
# Database specialist
You understand ACID properties, normalization, indexing strategies, and query optimization.

# Frontend specialist
You're expert in component architecture, state management, bundling, and performance optimization.

# DevOps specialist
You understand CI/CD pipelines, infrastructure as code, monitoring, and deployment strategies.
```

## Testing Your Subagents

### 1. Basic Functionality Test

```bash
# Create test subagent
cat > .claude/agents/test-specialist.md << 'EOF'
---
name: test-specialist
description: Testing for subagent creation
tools: Read
---

You are a test subagent. Always respond with "Test subagent working correctly!" followed by a brief analysis of what you were asked to do.
EOF

# Test invocation
claude "Use the test-specialist subagent to verify it's working"
```

### 2. Tool Access Validation

```bash
# Test with different tool configurations
claude "Use the test-specialist subagent to read the package.json file"

# Should work if Read tool is granted, fail otherwise
```

### 3. Integration Testing

```bash
# Test with complex workflows
claude "Use the test-specialist subagent as part of a larger code review process"
```

## Deployment and Management

### Project-Level vs User-Level

**Project-level subagents** (`.claude/agents/`):
- Specific to current project
- Version controlled with project
- Shared with team members
- Higher priority than user-level

**User-level subagents** (`~/.claude/agents/`):
- Available across all projects
- Personal customizations
- Lower priority
- Not shared by default

### Version Control Best Practices

```bash
# Include project subagents in git
git add .claude/agents/
git commit -m "Add custom subagents for project-specific workflows"

# Exclude user-level subagents
echo ".claude/user-agents/" >> .gitignore
```

### Team Collaboration

Create a shared subagents library:

```bash
# Create team subagents directory
mkdir -p .claude/agents/team/

# Document subagent purposes
cat > .claude/agents/README.md << 'EOF'
# Team Subagents

## Available Subagents

- `code-reviewer`: Security-focused code review
- `test-generator`: Automated test case creation
- `api-documenter`: API documentation specialist
- `performance-optimizer`: Performance analysis and optimization

## Usage Guidelines

- Use descriptive names for subagent invocations
- Always specify which subagent for complex workflows
- Report issues via team chat or tickets
EOF
```

---

Ready to create specialized subagents? Continue with [Advanced Subagent Patterns](/docs/subagents/advanced) for advanced configuration options.