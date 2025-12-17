import { join } from "node:path"
import { execa } from "execa"
import metadata from "./package.json" with { type: "json" }

// TODO: Merge build/compile folders

function makeShell(...paths: string[]) {
  return execa({
    cwd: join(import.meta.dirname, ...paths),
    stdout: ["inherit", "pipe"],
    verbose: "short",
    preferLocal: true,
  })
}

const $root = makeShell()
const $compile = makeShell("compile")
const $binaries = makeShell("compile", "binaries")

// Cleanup

await $root`rm -rf compile`
await $root`mkdir compile`

// Build dependencies

await $root`
pnpm deploy compile
--legacy
--production
--filter terminal
--config.node-linker=hoisted
`

// Remove binaries

const binaries = [
  { polars: "nodejs-polars-linux-x64-gnu" },
  { polars: "nodejs-polars-linux-x64-musl" },
]

for (const binary of binaries) {
  await $compile`rm -rf node_modules/${binary.polars}`
}

// Compile executable

const targets = [
  {
    name: "bun-linux-x64",
    dpkit: "linux-x64",
    polars: "nodejs-polars-linux-x64-gnu",
  },
  {
    name: "bun-linux-arm64",
    dpkit: "linux-arm64",
    polars: "nodejs-polars-linux-arm64-gnu",
  },
  {
    name: "bun-darwin-x64",
    dpkit: "macos-x64",
    polars: "nodejs-polars-darwin-x64",
  },
  {
    name: "bun-darwin-arm64",
    dpkit: "macos-arm64",
    polars: "nodejs-polars-darwin-arm64",
  },
  {
    name: "bun-windows-x64",
    dpkit: "windows-x64",
    polars: "nodejs-polars-win32-x64-msvc",
  },
]

for (const target of targets) {
  const folder = `dpkit-terminal-${metadata.version}-${target.dpkit}`

  for (const packageName of [target.polars]) {
    const pack = await $compile`npm pack ${packageName}`
    await $compile`mkdir -p node_modules/${packageName}`
    await $compile`tar -xzf ${pack.stdout} -C node_modules/${packageName} --strip-components=1`
    await $compile`rm ${pack.stdout}`
  }

  await $compile`
  bun build build/main.js
  --compile
  --outfile binaries/${folder}/dpkit
  --target ${target.name}
  `

  // For some reason bun creates it with no permissions
  if (target.name.startsWith("bun-windows")) {
    await $binaries`chmod +r ${folder}/dpkit.exe`
  }

  await $binaries`zip -r ${folder}.zip ${folder}`
  await $binaries`rm -rf ${folder}`

  await $compile`rm -rf node_modules/${target.polars}`
}

// Clean artifacts (pnpm creates an unwanted dpkit folder)

await $root`rm -rf terminal`
