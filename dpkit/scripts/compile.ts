import { join } from "node:path"
import { execa } from "execa"
import metadata from "../package.json" with { type: "json" }

function makeShell(...paths: string[]) {
  const cwd = join(import.meta.dirname, ...paths)
  return execa({ preferLocal: true, stdout: "inherit", cwd })
}

const $root = makeShell("..")
const $compile = makeShell("..", "compile")

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

// Compile executable

const targets = [
  { name: "bun-linux-x64", arch: "x86_64-unknown-linux" },
  { name: "bun-darwin-x64", arch: "x86_64-apple-darwin" },
  { name: "bun-windows-x64", arch: "x86_64-pc-windows" },
]

for (const target of targets) {
  await $compile`
  bun build main.ts
  --compile
  --outfile build/dp-${metadata.version}-${target.arch}/dp
  --target ${target.name}
  `
}

// Clean pnpm bug (it creates an unwanted dpkit folder)

await $root`rm -r dpkit`
