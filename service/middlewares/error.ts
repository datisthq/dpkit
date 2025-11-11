import { os } from "@orpc/server"

export const errorMiddleware = os
  .errors({
    ERROR: {},
  })
  .middleware(async ({ next, errors }) => {
    try {
      return await next()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw errors.ERROR({ message })
    }
  })
