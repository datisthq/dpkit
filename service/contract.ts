import contractJson from "./contract.json" with { type: "json" }
import type { router } from "./router.ts"

export const contract = contractJson as typeof router
