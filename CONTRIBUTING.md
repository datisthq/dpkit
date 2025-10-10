---
title: Contributing
sidebar:
  order: 2
---
Thank you for your interest in contributing to dpkit! This document provides guidelines and instructions for contributing to this project.

## Project Overview

Project is a monorepo with the following packages:

- `@dpkit/core`: Core metadata functionality
- `@dpkit/file`: File-related functionality
- `@dpkit/table`: Table-related functionality
- `@dpkit/cli`: Command-line interface for running tasks
- `@dpkit/<name>`: Domain-specific functionality
- `@dpkit/lib`: All-in-one package that re-exports all functionality

## Development Environment

### Prerequisites

- **Node.js**: v24.0.0 or higher
- **PNPM**: v10.0.0 or higher

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/dpkit.git dpkit
   cd dpkit
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```
## Development Workflow

### Code Style and Quality

We use Biome for linting and formatting, and TypeScript for type checking:

- **Lint**: Check for code issues
  ```bash
  pnpm run lint
  ```

- **Format**: Auto-fix formatting issues
  ```bash
  pnpm run format
  ```

- **Type Check**: Verify TypeScript types
  ```bash
  pnpm run type
  ```

- **Comprehensive Check**: Run lint and type checking
  ```bash
  pnpm run check
  ```

### Testing

Tests are located in `__spec__` directories and use Vitest:

- **Run All Tests**: (includes linting and type checking)
  ```bash
  pnpm test
  ```

- **Run Tests Only**: (without linting/type checking)
  ```bash
  pnpm run spec
  ```

- **Run a Specific Test**:
  ```bash
  pnpm exec vitest run core/actions/__spec__/findTask.ts
  ```

### Dependencies

Update all dependencies to their latest versions:

```bash
pnpm run bump
```
## Code Style Guidelines

- Use TypeScript with strict type checking
- Follow ES modules pattern (`import`/`export`)
- Tests should be placed in `__spec__` directories
- Use semicolons as needed (not required everywhere)
- Use arrow function parentheses as needed (omitted for single parameters)

## Making Changes to the Meta-Package

When adding new functionality:

1. Add it to the appropriate package first (`core`, `cli`, or `cron`)
2. Ensure it's properly exported from that package
3. No additional work is needed for the meta-package as it automatically re-exports everything

## Submitting Changes

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Make your changes with appropriate tests
3. Ensure the code passes all checks: `pnpm test`
4. Commit your changes with a descriptive message
5. Submit a pull request

## License

By contributing to dpkit, you agree that your contributions will be licensed under the project's license.

Thank you for your contribution!
