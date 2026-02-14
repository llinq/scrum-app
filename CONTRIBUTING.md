# Contributing to Scrum App

Thank you for your interest in contributing to Scrum App! We welcome contributions from the community and are excited to have you collaborate with us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. We expect all contributors to:

- Be respectful and considerate in communication
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community and the project

## How Can I Contribute?

There are many ways to contribute to Scrum App:

- **Report bugs**: Help us identify and fix issues
- **Suggest features**: Share ideas for new functionality
- **Write code**: Implement new features or fix bugs
- **Improve documentation**: Enhance READMEs, add examples, fix typos
- **Review pull requests**: Help review code from other contributors
- **Share feedback**: Let us know how you're using the app and what could be better

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/scrum-app.git
   cd scrum-app
   ```
3. **Install dependencies**:
   ```bash
   yarn install
   ```
4. **Set up environment variables**: Follow the setup instructions in the [main README](README.md)
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Application

```bash
# Start both API and Web in development mode
yarn start

# Or run them separately
yarn start:api   # API server on http://localhost:3001
yarn start:web   # Web app on http://localhost:3000
```

### Running Tests

```bash
# Run all tests
yarn test

# Run API tests
cd scrum-app-api && yarn test

# Run Web tests (if available)
cd scrum-app-web && yarn test
```

### Linting

```bash
# Lint all projects
yarn lint

# Lint specific project
yarn lint:api
yarn lint:web
```

### Building

```bash
# Build all projects
yarn build

# Build specific project
yarn build:api
yarn build:web
```

## Coding Standards

### General Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Type Safety**: Avoid using `any` type; use proper types
- **Naming Conventions**: 
  - Use `camelCase` for variables and functions
  - Use `PascalCase` for classes and React components
  - Use `UPPER_SNAKE_CASE` for constants
- **Comments**: Add comments for complex logic, but prefer self-documenting code
- **File Organization**: Keep files focused and reasonably sized (< 300 lines when possible)

### Backend (NestJS)

- Follow NestJS best practices and conventions
- Use dependency injection properly
- Implement proper error handling with exception filters
- Add validation using class-validator decorators
- Write unit tests for services and controllers
- Update Swagger documentation for new endpoints

### Frontend (Next.js + React)

- Use functional components with hooks
- Prefer React Server Components when possible
- Keep components small and focused
- Use Tailwind CSS for styling (avoid inline styles)
- Implement proper error boundaries
- Ensure responsive design works on mobile, tablet, and desktop
- Add loading states for async operations

### Database

- Use TypeORM entities and migrations
- Add proper indexes for performance
- Use transactions when needed
- Follow naming conventions for tables and columns

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```bash
feat(retro): add blur mode for card content
fix(auth): resolve JWT token expiration issue
docs(readme): update setup instructions for Docker
refactor(api): simplify voting logic in retro service
```

## Pull Request Process

1. **Update your fork** with the latest changes from main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Ensure your changes work**:
   - Code runs without errors
   - Tests pass (if applicable)
   - Linter passes (`yarn lint`)
   - Application builds successfully (`yarn build`)

3. **Create a Pull Request**:
   - Write a clear title describing the change
   - Fill out the PR description with:
     - What changes were made
     - Why these changes are needed
     - How to test the changes
     - Screenshots (for UI changes)
   - Link any related issues

4. **Respond to feedback**:
   - Address review comments promptly
   - Make requested changes in new commits
   - Re-request review after updates

5. **Merge**:
   - Once approved, a maintainer will merge your PR
   - Your branch will be deleted after merge

## Reporting Bugs

When reporting bugs, please include:

- **Clear title**: Describe the issue concisely
- **Description**: Detailed explanation of the problem
- **Steps to reproduce**: How to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, Node.js version, etc.
- **Screenshots**: Visual evidence (if applicable)
- **Logs**: Error messages or console output

Use the [GitHub Issues](https://github.com/llinq/scrum-app/issues) page to report bugs.

## Suggesting Enhancements

We love new ideas! When suggesting features:

- **Check existing issues**: See if someone already suggested it
- **Describe the problem**: What use case does this solve?
- **Propose a solution**: How should it work?
- **Consider alternatives**: Are there other ways to solve this?
- **Additional context**: Mockups, examples, or references

Use the [GitHub Issues](https://github.com/llinq/scrum-app/issues) page to suggest enhancements.

## Questions?

If you have questions about contributing:

- Check the [main README](README.md) for project documentation
- Review existing [issues](https://github.com/llinq/scrum-app/issues) and [pull requests](https://github.com/llinq/scrum-app/pulls)
- Open a new issue with the question label
- Reach out to the maintainers

## License

By contributing to Scrum App, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Scrum App! Your efforts help make this project better for everyone. 🎉
