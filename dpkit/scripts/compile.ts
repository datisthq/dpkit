import { join } from "node:path"
import { execa } from "execa"
import metadata from "../package.json" with { type: "json" }

// TODO: Enable SQLite support

function makeShell(...paths: string[]) {
  return execa({
    cwd: join(import.meta.dirname, ...paths),
    stdout: ["inherit", "pipe"],
    verbose: "short",
    preferLocal: true,
  })
}

const $root = makeShell("..")
const $compile = makeShell("..", "compile")
const $build = makeShell("..", "compile", "build")

// Cleanup

await $root`rm -rf build`
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

// Remove binaries

const binaries = [
  { polars: "nodejs-polars-linux-x64-gnu", libsql: "libsql-linux-x64-gnu" },
  { polars: "nodejs-polars-linux-x64-musl", libsql: "libsql-linux-x64-musl" },
]

for (const binary of binaries) {
  await $compile`rm -rf node_modules/${binary.polars}`
  //await $compile`rm -rf node_modules/${binary.libsql}`
}

// Compile executable

const targets = [
  {
    name: "bun-linux-x64",
    dpkit: "linux-x64",
    polars: "nodejs-polars-linux-x64-gnu",
    libsql: "libsql-linux-x64-gnu",
  },
  {
    // Github Actions doesn't support AVX
    name: "bun-darwin-x64-baseline",
    dpkit: "macos-x64",
    polars: "nodejs-polars-darwin-x64",
    libsql: "libsql-darwin-x64",
  },
  {
    name: "bun-windows-x64",
    dpkit: "windows-x64",
    polars: "nodejs-polars-win32-x64-msvc",
    libsql: "libsql-win32-x64-msvc",
  },
]

for (const target of targets) {
  const folder = `dp-${metadata.version}-${target.dpkit}`

  for (const packageName of [target.polars]) {
    //for (const packageName of [target.polars, target.libsql]) {
    const pack = await $compile`npm pack ${packageName}`
    await $compile`mkdir -p node_modules/${packageName}`
    await $compile`tar -xzf ${pack.stdout} -C node_modules/${packageName} --strip-components=1`
    await $compile`rm ${pack.stdout}`
  }

  await $compile`
  bun build main.ts
  --compile
  --outfile build/${folder}/dp
  --target ${target.name}
  `

  // For some reason bun creates it with no permissions
  if (target.name === "bun-windows-x64") {
    await $build`chmod +r ${folder}/dp.exe`
  }

  await $build`zip -r ${folder}.zip ${folder}`
  await $build`rm -rf ${folder}`

  await $compile`rm -rf node_modules/${target.polars}`
  //await $compile`rm -rf node_modules/${target.libsql}`
}

// Clean artifacts (pnpm creates an unwanted dpkit folder)

await $root`rm -rf dpkit`
