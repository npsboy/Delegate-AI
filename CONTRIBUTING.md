# Contributing to Delegate-AI

Thank you for your interest in contributing to Delegate-AI! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your contribution
5. Make your changes
6. Test your changes
7. Submit a pull request

## How to Contribute

There are many ways to contribute to Delegate-AI:

- **Report bugs**: If you find a bug, please create an issue
- **Suggest features**: Have an idea? Open an issue to discuss it
- **Improve documentation**: Help us improve our docs
- **Write code**: Fix bugs or implement new features
- **Review pull requests**: Help review code from other contributors

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/Delegate-AI.git
cd Delegate-AI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run deploy` - Deploys the app to GitHub Pages

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow the existing code style in the project
- Use meaningful variable and function names
- Write self-documenting code with clear logic
- Add comments for complex logic
- Use ESLint for code linting (follows `react-app` rules)

### File Structure

- Place components in the `src/components` directory
- Keep styles organized and modular
- Follow the existing project structure

### Best Practices

- Keep components small and focused
- Avoid prop drilling - use React Context when appropriate
- Handle errors gracefully
- Ensure responsive design for mobile and desktop
- Follow accessibility (a11y) best practices
- Optimize performance (lazy loading, memoization when needed)

## Testing

- Write tests for new features and bug fixes
- Ensure all existing tests pass before submitting PR
- Use React Testing Library for component tests
- Run tests with: `npm test`
- Aim for meaningful test coverage, not just high percentages

### Running Tests

```bash
npm test
```

## Commit Guidelines

We follow conventional commit messages for clarity and consistency:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.
- `perf`: Performance improvements

### Examples

```
feat(speech): add moderated caucus speech generation

fix(position-paper): resolve formatting issue in PDF export

docs(readme): update installation instructions

test(allies): add unit tests for allies component
```

### Guidelines

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end of the subject line
- Limit the subject line to 50 characters
- Separate subject from body with a blank line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

## Pull Request Process

1. **Create a branch**: Use a descriptive branch name
   ```bash
   git checkout -b feature/add-new-committee-support
   git checkout -b fix/pdf-export-bug
   ```

2. **Make your changes**: Write clean, documented code

3. **Test thoroughly**: Ensure all tests pass and the app works as expected

4. **Commit your changes**: Follow the commit guidelines above

5. **Push to your fork**:
   ```bash
   git push origin your-branch-name
   ```

6. **Open a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues (e.g., "Closes #123")
   - Describe what changes you made and why
   - Include screenshots for UI changes
   - List any breaking changes

7. **Respond to feedback**: Be open to suggestions and make requested changes

8. **Wait for review**: A maintainer will review your PR

### PR Requirements

- [ ] Code follows the project's coding standards
- [ ] All tests pass
- [ ] New features include appropriate tests
- [ ] Documentation is updated if needed
- [ ] Commit messages follow the guidelines
- [ ] No merge conflicts with the main branch
- [ ] UI changes are responsive and accessible

## Reporting Bugs

Before creating a bug report, please check if the issue already exists.

### How to Submit a Bug Report

1. Use the GitHub issue tracker
2. Use a clear and descriptive title
3. Describe the exact steps to reproduce the problem
4. Provide specific examples to demonstrate the steps
5. Describe the behavior you observed and what you expected
6. Include screenshots if applicable
7. Include your environment details:
   - Browser and version
   - Operating system
   - Node.js version (for development issues)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Version: [e.g. 0.1.0]

**Additional context**
Add any other context about the problem.
```

## Suggesting Enhancements

We welcome feature suggestions! Before creating an enhancement suggestion:

1. Check if there's already an issue for it
2. Consider if it aligns with the project's goals
3. Think about how it would benefit users

### Enhancement Suggestion Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

## Questions?

If you have questions, feel free to:
- Open a discussion on GitHub
- Create an issue with the "question" label
- Reach out to the maintainers

## Recognition

Contributors will be recognized in our project. Thank you for making Delegate-AI better!

---

*Thank you for contributing to Delegate-AI! Your efforts help students worldwide prepare better for Model United Nations conferences.*
