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

// Normalize package.json

await $compile`
sed -i /workspace:/d package.json
`

// Uninstall binaries

const binaries = [
  { polars: "nodejs-polars-linux-x64-gnu", libsql: "@libsql/linux-x64-gnu" },
  { polars: "nodejs-polars-linux-x64-musl", libsql: "@libsql/linux-x64-musl" },
]

for (const binary of binaries) {
  await $compile`npm uninstall ${binary.polars}`
  await $compile`npm uninstall ${binary.libsql}`
}

// Compile executable

const targets = [
  {
    name: "bun-linux-x64",
    arch: "x86_64-unknown-linux",
    polars: "nodejs-polars-linux-x64-musl",
    libsql: "@libsql/linux-x64-gnu",
  },
  {
    name: "bun-darwin-x64",
    arch: "x86_64-apple-darwin",
    polars: "nodejs-polars-darwin-x64",
    libsql: "@libsql/darwin-x64",
  },
  {
    name: "bun-windows-x64",
    arch: "x86_64-pc-windows",
    polars: "nodejs-polars-win32-x64-msvc",
    libsql: "@libsql/win32-x64-msvc",
  },
]

for (const target of targets) {
  await $compile`npm install ${target.polars} --force`
  await $compile`npm install ${target.libsql} --force`

  await $compile`
  bun build main.ts
  --compile
  --outfile build/dp-${metadata.version}-${target.arch}/dp
  --target ${target.name}
  `
}

// Clean artifacts (pnpm creates an unwanted dpkit folder)

await $root`rm -r dpkit`
