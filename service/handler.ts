import { implement } from "@orpc/server"
import { contract } from "./contract.ts"
import { errorMiddleware } from "./middlewares/error.ts"

export const handler = implement(contract).use(errorMiddleware)
