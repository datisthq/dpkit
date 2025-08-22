import { execa } from "execa"
import metadata from "../package.json" with { type: "json" }
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

await $({
  cwd: "compile",
})`deno compile --allow-all --no-check --output build/dp-${metadata.version}-x86_64-unknown-linux-gnu main.ts`
