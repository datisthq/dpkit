#!cli/node_modules/.bin/tsx
import { execute } from "@oclif/core"

await execute({ dir: import.meta.url, development: true })
