import { join } from "node:path"
import { execa } from "execa"
import metadata from "../package.json" with { type: "json" }

const $ = execa({
  preferLocal: true,
  stdout: ["inherit"],
  cwd: join(import.meta.dirname, ".."),
})

// Cleanup

await $`rm -rf compile`
await $`mkdir compile`

// Build dependencies

await $`
pnpm deploy compile
--legacy
--production
--filter dpkit
--config.node-linker=hoisted
`

// Linux

//await $`
//deno compile
//--allow-all
//--no-check
//--output compile/targets/dp-${metadata.version}-x86_64-unknown-linux-gnu
//compile/main.ts
//`

// Clean pnpm bug (it creates an unwanted dpkit folder)

await $`rm -r dpkit`
