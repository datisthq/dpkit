import fs from "node:fs"
import { join } from "node:path"
import { minifyContractRouter } from "@orpc/contract"
import { router } from "./router.ts"

const contractJson = minifyContractRouter(router)

fs.writeFileSync(
  join(import.meta.dirname, "contract.json"),
  `${JSON.stringify(contractJson, null, 2)}\n`,
)
