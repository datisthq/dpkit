import { join } from "node:path"
import * as execa from "execa"
import metadata from "../package.json" with { type: "json" }

const $root = execa.$({ cwd: join(import.meta.dirname, "..") })
const $compile = execa.$({ cwd: join(import.meta.dirname, "..", "compile") })

// Cleanup

await $root`rm -rf compile`
await $root`mkdir compile`

// Build dependencies

await $root`
pnpm deploy compile
--legacy
--production
--filter dpkit
--config.node-linker=hoisted
`

// Linux

await $compile`
bun build main.ts
--compile
--outfile build/dp-${metadata.version}-x86_64-unknown-linux-gnu
--target bun-linux-x64
`

// Clean pnpm bug (it creates an unwanted dpkit folder)

await $root`rm -r dpkit`
