import { oc } from "@orpc/contract"
import * as z from "zod"

export const validatePackage = oc
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
