import { os } from "@orpc/server"

export const baseEndpoint = os.errors({
  ERROR: {},
})

const errorMiddleware = baseEndpoint.middleware(async ({ next, errors }) => {
  try {
    return await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw errors.ERROR({ message })
  }
})

export const endpoint = baseEndpoint.use(errorMiddleware)
