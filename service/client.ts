import type { RouterClient } from "@orpc/server"
import type { router } from "./router.ts"

export type Client = RouterClient<typeof router>
