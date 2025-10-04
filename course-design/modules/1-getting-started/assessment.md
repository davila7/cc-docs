# Module 1 Assessment: Development Environment Setup and First Tasks

## Overview

This practical assessment evaluates your ability to install, configure, and use Claude Code for basic development tasks. You'll work with a sample project to demonstrate the skills learned in Module 1.

**Duration:** 60-90 minutes
**Type:** Hands-on practical exercise
**Pass Criteria:** Complete all required tasks successfully

## Prerequisites

- Completed all Module 1 lessons
- Access to a terminal/command prompt
- Sample project downloaded (provided below)

## Assessment Tasks

### Part 1: Installation and Authentication (15 points)

**Task 1.1: Install Claude Code**
- [ ] Install Claude Code using your preferred method (npm or native)
- [ ] Verify installation with `claude --version`
- [ ] Document the installation method you used

**Task 1.2: Authentication**
- [ ] Authenticate with Claude.ai or Anthropic Console
- [ ] Verify successful authentication
- [ ] Take a screenshot or note the confirmation message

**Deliverable:** Short report (2-3 sentences) describing your installation and authentication process.

---

### Part 2: Command Modes (20 points)

**Task 2.1: Interactive Mode**
- [ ] Start an interactive session in the sample project
- [ ] Ask at least 3 different questions about the project
- [ ] Document the questions and summarized responses

**Task 2.2: Query Mode**
- [ ] Use query mode to find specific information
- [ ] Execute at least 2 different query commands
- [ ] Record the commands and results

**Task 2.3: One-Time Task**
- [ ] Execute a one-time task to make a simple modification
- [ ] Verify the change was applied
- [ ] Document the command used

**Deliverable:** Command log showing all commands executed and their purposes.

---

### Part 3: Codebase Navigation (25 points)

Using the sample project, answer these questions using Claude Code:

**Task 3.1: Project Understanding**
1. [ ] What does this project do?
2. [ ] What technologies/frameworks are used?
3. [ ] Where is the main entry point?
4. [ ] What is the folder structure?
5. [ ] How many files are in the project?

**Task 3.2: Code Location**
6. [ ] Where is [specific functionality] implemented?
7. [ ] Which file contains [specific component/function]?
8. [ ] What files are in the [specific directory]?

**Task 3.3: Code Analysis**
9. [ ] How does [specific feature] work?
10. [ ] What dependencies does [component] have?

**Deliverable:** Document with all 10 questions and accurate answers obtained through Claude Code.

---

### Part 4: Code Modifications (25 points)

**Task 4.1: Simple Addition**
- [ ] Add a comment to the main file explaining its purpose
- [ ] Review the proposed change before approving
- [ ] Verify the comment was added correctly

**Task 4.2: Configuration Change**
- [ ] Modify a configuration value (e.g., port, timeout, or setting)
- [ ] Document what you changed and why
- [ ] Verify the change works correctly

**Task 4.3: Function Creation**
- [ ] Add a new utility function to an appropriate file
- [ ] Ensure the function follows project conventions
- [ ] Test or verify the function works

**Deliverable:** Git diff or screenshot showing the changes made, plus brief description of each modification.

---

### Part 5: Session Management (15 points)

**Task 5.1: Session Continuation**
- [ ] Start a session and make a change
- [ ] Exit the session
- [ ] Continue the session and make another related change
- [ ] Document the workflow

**Task 5.2: Context Management**
- [ ] Start a session, clear history, and begin a new task
- [ ] Document when and why you cleared context
- [ ] Show understanding of when to clear vs. continue

**Task 5.3: Session Summary**
- [ ] Summarize what you accomplished in your session
- [ ] List all files modified
- [ ] Document remaining tasks (if any)

**Deliverable:** Session log showing the complete workflow with explanations.

---

## Sample Project Setup

### Option A: Use Your Own Project
You may use any existing small to medium-sized project you have access to.

### Option B: Clone Sample Project

```bash
# Create a sample project for practice
mkdir claude-code-assessment
cd claude-code-assessment

# Initialize a simple Node.js project
npm init -y

# Create sample files
mkdir src tests
touch src/index.js src/utils.js src/config.js
touch tests/utils.test.js
touch README.md

# Add some code to practice with
echo "// Main application entry point" > src/index.js
echo "const config = { port: 3000 }; module.exports = config;" > src/config.js
```

### Option C: Download Provided Sample
[Link to provided sample project would be here]

---

## Submission Requirements

### Required Deliverables

1. **Installation Report** (Part 1)
   - Installation method used
   - Authentication confirmation

2. **Command Log** (Part 2)
   - All commands executed
   - Purpose of each command
   - Results obtained

3. **Navigation Documentation** (Part 3)
   - All 10 questions and answers
   - Screenshots if helpful

4. **Modification Evidence** (Part 4)
   - Git diff or screenshots of changes
   - Description of each modification
   - Verification notes

5. **Session Workflow Log** (Part 5)
   - Complete session workflow
   - Context management decisions
   - Summary of work

### Submission Format

Create a single document (Markdown or PDF) containing:

```markdown
# Module 1 Assessment Submission

**Student Name:** [Your Name]
**Date:** [Date]

## Part 1: Installation and Authentication
[Your installation report]

## Part 2: Command Modes
[Your command log]

## Part 3: Codebase Navigation
[Your navigation documentation]

## Part 4: Code Modifications
[Your modification evidence]

## Part 5: Session Management
[Your session workflow log]

## Reflection
[Brief reflection on what you learned]
```

---

## Grading Rubric

### Installation and Authentication (15 points)
- **15 pts:** Successful installation and authentication, clear documentation
- **10 pts:** Successful installation with minor documentation issues
- **5 pts:** Installation successful but poor documentation
- **0 pts:** Unable to install or authenticate

### Command Modes (20 points)
- **20 pts:** Correctly used all three modes with appropriate documentation
- **15 pts:** Used all modes with minor errors in application
- **10 pts:** Used 2/3 modes correctly
- **5 pts:** Used only 1 mode correctly
- **0 pts:** Unable to use command modes

### Codebase Navigation (25 points)
- **25 pts:** All 10 questions answered accurately using Claude Code
- **20 pts:** 8-9 questions answered accurately
- **15 pts:** 6-7 questions answered accurately
- **10 pts:** 4-5 questions answered accurately
- **0 pts:** Fewer than 4 questions answered

### Code Modifications (25 points)
- **25 pts:** All modifications completed correctly with proper review process
- **20 pts:** All modifications completed with minor issues
- **15 pts:** 2/3 modifications completed correctly
- **10 pts:** 1/3 modifications completed correctly
- **0 pts:** No successful modifications

### Session Management (15 points)
- **15 pts:** Excellent session management with clear understanding
- **12 pts:** Good session management with minor issues
- **8 pts:** Basic session management demonstrated
- **4 pts:** Poor session management
- **0 pts:** No session management demonstrated

### Total: 100 points

**Passing Score:** 70/100

---

## Success Criteria

To pass this assessment, you must:

✅ Successfully install and authenticate Claude Code (LO 1.1)
✅ Execute commands in at least 2 different modes (LO 1.2)
✅ Navigate the codebase using natural language (LO 1.3)
✅ Make code modifications with proper review (LO 1.2)
✅ Manage sessions effectively (LO 1.2, 1.3)

---

## Assessment Tips

### Before You Start
1. Review all Module 1 materials
2. Ensure Claude Code is installed and working
3. Have the sample project ready
4. Prepare to document your work

### During the Assessment
1. Read each task carefully
2. Document as you go (don't wait until the end)
3. Take screenshots of important steps
4. Ask Claude Code for help if stuck
5. Test your changes before moving on

### Common Pitfalls to Avoid
❌ Not reviewing changes before approving
❌ Using only one command mode
❌ Vague questions that get unclear answers
❌ Not documenting your process
❌ Rushing through without verification

### Good Practices
✅ Be specific with queries and tasks
✅ Review every change Claude proposes
✅ Test modifications after applying them
✅ Keep clear notes throughout
✅ Use appropriate command modes for each task

---

## Self-Assessment Checklist

Before submitting, verify:

- [ ] All required tasks completed
- [ ] All deliverables included
- [ ] Documentation is clear and complete
- [ ] Screenshots/evidence provided where needed
- [ ] Code changes are verified and working
- [ ] Session workflow is well-documented
- [ ] Reflection section completed
- [ ] Document is well-formatted and readable

---

## After the Assessment

### If You Pass (70+)
Congratulations! Proceed to [Module 2: Core Development Workflows](../2-core-workflows/README.md)

### If You Need to Retry (<70)
Review the areas where you struggled:
- Revisit relevant lessons
- Practice the specific skills
- Ask for help if needed
- Retake when ready

---

## Getting Help

If you encounter issues during the assessment:

1. **Check Module 1 materials** - Review the relevant lesson
2. **Ask Claude Code** - Use `/help` or ask "how do I..."
3. **Troubleshooting guide** - Review common issues
4. **Instructor/TA** - Reach out for technical support

---

## Time Management Suggestion

- Part 1: 15 minutes
- Part 2: 15 minutes
- Part 3: 20 minutes
- Part 4: 20 minutes
- Part 5: 15 minutes
- Documentation: 15 minutes
- Total: ~90 minutes (includes buffer time)

---

## Additional Notes

- This is an **open-book** assessment - use all Module 1 resources
- You may use Claude Code to help with the assessment itself
- Focus on demonstrating the skills, not just completing tasks
- Quality of documentation matters as much as completing tasks

Good luck! 🚀
