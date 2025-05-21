# Claude

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Lint:** `pnpm run lint` (Biome for linting)
- **Format:** `pnpm run format` (Biome auto-fix)
- **Type Check:** `pnpm run type` (TypeScript)
- **Test All:** `pnpm run test` (lint+type+tests)
- **Tests Only:** `pnpm run spec` (Vitest)
- **Single Test:** `pnpm exec vitest run -t "test name"` or `pnpm exec vitest run path/to/test.ts`

## Style Guidelines
- **Formatting:** 2-space indent, UTF-8, LF endings
- **Types:** Strict TypeScript with null checks
- **Naming:** PascalCase for classes/interfaces, camelCase for methods/variables
- **Ordering:** In a file, high-level items first (public), low-level last (private)
- **Imports:** ES modules, imports with full path including ".js" file extension
- **Testing:** Unit tests in `<module>.spec.ts` files; don't add useless comments like "Arrange", "Act", "Assert", etc
- **Documentation:** Typedoc comments only for public APIs (don't add for files); don't add @params etc directives
- **Comments:** Comments starting from `//` are forbidden for you
- **Todos:** If you asked to resolve TODO, follow the instructions literally
- **Linting:** Don't run linting as a part of your tasks

