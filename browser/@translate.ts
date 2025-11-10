import { execa } from "execa"

const $ = execa({
  stdout: ["inherit", "pipe"],
  verbose: "short",
  preferLocal: true,
})

await $`pnpm lingui extract`
await $`pnpm lingui compile`
