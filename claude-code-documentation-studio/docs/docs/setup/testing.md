---
sidebar_position: 5
---

# End-to-End Testing Guide

> Complete testing workflow to verify your automated documentation system works correctly from code changes to Discord notifications.

## Overview

This guide walks you through testing the complete documentation automation pipeline:

1. **Code Change** → 2. **PR Creation** → 3. **Agent Execution** → 4. **Documentation Update** → 5. **Discord Notification**

## Prerequisites Checklist

Before testing, verify you have completed:

- ✅ [Docusaurus Expert Agent](/docs/subagents/agent-case-1) installed
- ✅ [Discord Notification Hook](/docs/hooks/hook-case-1) configured
- ✅ [GitHub Actions Workflow](/docs/workflows/cicd-workflow) deployed
- ✅ [Discord Webhook](/docs/setup/discord-setup) set up

## Test Scenario 1: New Feature Documentation

This test simulates adding a new feature to your codebase and verifying that documentation is automatically generated.

### Step 1: Create Test Feature

Create a new feature file that should trigger documentation updates:

```bash
# Navigate to your project root
cd your-project

# Create a new feature file
mkdir -p src/features
cat > src/features/userProfile.js << 'EOF'
/**
 * User Profile Management API
 * @description Handles user profile operations including avatar upload and data management
 * @author Claude Code Documentation Studio
 */

/**
 * Retrieves the current user's profile information
 * @route GET /api/users/profile
 * @param {string} userId - The user ID to fetch profile for
 * @param {Object} options - Additional options for profile retrieval
 * @param {boolean} options.includeAvatar - Whether to include avatar URL
 * @param {boolean} options.includePreferences - Whether to include user preferences
 * @returns {Promise<Object>} User profile data
 * @example
 * const profile = await getUserProfile('user123', { includeAvatar: true });
 * console.log(profile.username); // 'john_doe'
 */
export async function getUserProfile(userId, options = {}) {
  const { includeAvatar = false, includePreferences = false } = options;

  try {
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      ...(includeAvatar && { avatarUrl: data.avatar_url }),
      ...(includePreferences && { preferences: data.preferences })
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Updates user profile information
 * @route PUT /api/users/profile
 * @param {string} userId - The user ID to update
 * @param {Object} profileData - Updated profile data
 * @param {string} profileData.username - New username
 * @param {string} profileData.email - New email address
 * @param {File} profileData.avatar - New avatar file (optional)
 * @returns {Promise<Object>} Updated profile data
 */
export async function updateUserProfile(userId, profileData) {
  const formData = new FormData();

  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  try {
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

function getAuthToken() {
  return localStorage.getItem('authToken') || '';
}
EOF

echo "✅ Test feature file created: src/features/userProfile.js"
```

### Step 2: Create Feature Branch and Commit

```bash
# Create feature branch
git checkout -b feature/user-profile-api

# Add and commit the new feature
git add src/features/userProfile.js
git commit -m "feat(api): add user profile management with avatar upload

- Add getUserProfile() function with configurable options
- Add updateUserProfile() function with FormData support
- Include proper error handling and authentication
- Support avatar upload via multipart form data
- Add comprehensive JSDoc documentation"

# Push feature branch
git push origin feature/user-profile-api
```

### Step 3: Create Pull Request

Create a pull request to trigger the documentation workflow:

```bash
# Create PR using GitHub CLI (if available)
gh pr create \
  --title "✨ Add User Profile Management API" \
  --body "## New Feature: User Profile API

This PR introduces comprehensive user profile management functionality:

### Added Functions:
- \`getUserProfile(userId, options)\` - Retrieve user profile data
- \`updateUserProfile(userId, profileData)\` - Update profile with avatar support

### Key Features:
- 🔐 Authentication required for all operations
- 📸 Avatar upload support via FormData
- ⚙️ Configurable profile data inclusion
- 🛡️ Comprehensive error handling
- 📚 Full JSDoc documentation

### API Endpoints:
- \`GET /api/users/{userId}/profile\` - Fetch profile
- \`PUT /api/users/{userId}/profile\` - Update profile

This should trigger our automated documentation workflow to create corresponding documentation updates."
```

Alternatively, create the PR through GitHub's web interface.

### Step 4: Monitor Workflow Execution

Once the PR is created, monitor the GitHub Actions workflow:

1. **Navigate to Actions tab** in your GitHub repository
2. **Find the "Docusaurus Documentation Automation" workflow**
3. **Click on the running workflow** to view detailed logs

#### Expected Workflow Steps:

```
✅ Checkout repository
✅ Setup Claude configuration
✅ Create Discord notification hook
✅ Get changed files
✅ Update documentation (Claude Code agent execution)
✅ Create Pull Request
✅ Send Discord notification
✅ Workflow Summary
```

### Step 5: Verify Documentation PR

The workflow should create a new documentation PR:

1. **Check for new PR** with title "📚 Documentation Update - Automated"
2. **Review the PR description** which should list your changed files
3. **Examine the documentation changes** created by the agent

#### Expected Documentation Updates:

- New API documentation file (e.g., `docs/api/user-profile.md`)
- Updated navigation/sidebar if needed
- Code examples matching your implementation
- Proper API reference format

### Step 6: Check Discord Notification

Verify the Discord notification was sent:

1. **Check your Discord channel** for the documentation bot message
2. **Verify the embed contains:**
   - PR title and link
   - Changed files list
   - Direct link to review the documentation PR
   - Proper formatting and colors

## Test Scenario 2: API Endpoint Update

Test how the system handles updates to existing functionality.

### Step 1: Modify Existing Function

Update the user profile function to add new parameters:

```bash
# Edit the existing function
cat >> src/features/userProfile.js << 'EOF'

/**
 * Deletes a user profile
 * @route DELETE /api/users/profile
 * @param {string} userId - The user ID to delete
 * @param {Object} options - Deletion options
 * @param {boolean} options.permanentDelete - Whether to permanently delete or soft delete
 * @param {string} options.reason - Reason for deletion (required for permanent deletion)
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteUserProfile(userId, options = {}) {
  const { permanentDelete = false, reason } = options;

  if (permanentDelete && !reason) {
    throw new Error('Reason is required for permanent deletion');
  }

  try {
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        permanent: permanentDelete,
        reason: reason
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to delete profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}
EOF
```

### Step 2: Commit and Test Workflow

```bash
# Commit the update
git add src/features/userProfile.js
git commit -m "feat(api): add deleteUserProfile function with soft/hard delete options"
git push origin feature/user-profile-api
```

The existing PR will be updated, triggering another workflow run.

## Test Scenario 3: Error Handling

Test how the system handles various error conditions.

### Step 3.1: Invalid File Changes

Create a change that shouldn't trigger documentation:

```bash
# Create a file that should be excluded
echo "node_modules/" > .gitignore
git add .gitignore
git commit -m "chore: update gitignore"
git push origin feature/user-profile-api
```

**Expected Result**: No documentation workflow should trigger due to the exclusion patterns.

### Step 3.2: Discord Webhook Failure

Temporarily break the Discord webhook to test error handling:

```bash
# In GitHub repository settings, temporarily change DISCORD_WEBHOOK_URL to an invalid URL
# Then trigger the workflow again
```

**Expected Result**: Workflow should complete successfully but log Discord notification failure.

## Validation Checklist

After completing the tests, verify:

### ✅ Agent Functionality
- [ ] Docusaurus Expert agent executed successfully
- [ ] Documentation generated matches code changes
- [ ] Code examples are accurate and functional
- [ ] Proper formatting and style consistency

### ✅ Hook Integration
- [ ] Discord notification sent for successful documentation updates
- [ ] Rich embed format with proper information
- [ ] Links to documentation PR work correctly
- [ ] Error handling graceful when Discord fails

### ✅ Workflow Automation
- [ ] GitHub Actions triggered on appropriate file changes
- [ ] Excluded paths properly ignored
- [ ] Documentation PR created with descriptive content
- [ ] Workflow summary generated correctly

### ✅ End-to-End Process
- [ ] Code changes → Documentation updates automatically
- [ ] Team notified via Discord
- [ ] Documentation PR ready for review
- [ ] Process repeatable and reliable

## Performance Testing

### Workflow Execution Time

Monitor workflow performance:

```bash
# Check workflow duration in GitHub Actions
# Typical execution times:
# - Setup: 30-60 seconds
# - Agent execution: 2-5 minutes
# - PR creation: 10-30 seconds
# - Discord notification: 5-10 seconds
# Total: 3-7 minutes
```

### Agent Response Quality

Evaluate the Docusaurus Expert agent's output quality:

- **Accuracy**: Documentation matches actual code functionality
- **Completeness**: All new features properly documented
- **Style**: Consistent with existing documentation
- **Examples**: Code examples are correct and helpful

## Troubleshooting Common Issues

### Workflow Not Triggering

```bash
# Check file paths in workflow trigger
# Verify changed files match the patterns
git diff --name-only main...feature/user-profile-api

# Common issues:
# - Files excluded by workflow paths filter
# - Branch protection rules preventing workflow execution
# - Missing workflow file or syntax errors
```

### Agent Execution Failures

```bash
# Check Claude Code agent logs in GitHub Actions
# Common issues:
# - Invalid Anthropic API key
# - Agent not properly installed
# - Insufficient permissions for file operations
```

### Discord Notification Issues

```bash
# Test webhook manually
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'

# Common issues:
# - Invalid webhook URL
# - Discord server permissions
# - Rate limiting
```

## Advanced Testing Scenarios

### Large-Scale Changes

Test with multiple file changes:

```bash
# Create multiple new features simultaneously
# Verify agent handles complex documentation requirements
# Check Discord notification includes all relevant changes
```

### Concurrent PRs

Test with multiple simultaneous pull requests:

```bash
# Create multiple feature branches
# Submit PRs simultaneously
# Verify each gets proper documentation treatment
```

### Documentation-Only Changes

Test exclusion of documentation changes:

```bash
# Make changes only to docs/ folder
# Verify workflow doesn't create infinite loops
```

## Success Metrics

Your automation system is working correctly when:

- **🚀 Speed**: Documentation updated within 5 minutes of code changes
- **📋 Accuracy**: 90%+ of generated documentation requires minimal manual editing
- **🔔 Reliability**: Discord notifications sent for 95%+ of documentation updates
- **⚡ Efficiency**: Team spends 80% less time on manual documentation tasks

## Next Steps

Once testing is complete:

1. **Train your team** on the new documentation workflow
2. **Establish review processes** for automated documentation PRs
3. **Monitor and optimize** agent performance over time
4. **Expand automation** to additional documentation types

---

*Testing complete? Your intelligent documentation system is now ready for production use! 🎉*