import * as dpkit from "@dpkit/lib"
import * as z from "zod"
import { endpoint } from "../../endpoint.ts"

export const validatePackage = endpoint
  .route({
    method: "POST",
    path: "/package/validate",
  })
  .input(
    z.object({
      source: z.union([z.string(), z.record(z.string(), z.unknown())]),
    }),
  )
  .output(
    z.object({
      valid: z.boolean(),
      errors: z.array(z.record(z.string(), z.any())),
    }),
  )
  .handler(async ({ input }) => {
    const { source } = input
    const result = await dpkit.validatePackage(source)
    return result
  })
