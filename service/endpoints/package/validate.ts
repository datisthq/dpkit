import * as dpkit from "@dpkit/lib"
import { os } from "@orpc/server"
import * as z from "zod"

export const validatePackage = os
  .input(
    z.object({
      source: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { source } = input
    const result = await dpkit.validatePackage(source)
    return result
  })
