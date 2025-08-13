import { execa } from "execa"
const $ = execa({ preferLocal: true, stdout: ["inherit"] })

// Cleanup

await $`rm -rf compile`
await $`mkdir compile`

// Prepare dependencies

await $`
pnpm deploy compile
--legacy
--production
--filter cli
--config.node-linker=hoisted
`

// Compile application

await $({ cwd: "compile" })`deno compile --allow-all main.ts`
