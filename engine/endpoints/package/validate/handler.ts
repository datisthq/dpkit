import * as dpkit from "@dpkit/library"
import { handler } from "../../../handler.ts"

export const validatePackage = handler.package.validate.handler(
  async ({ input }) => {
    const { source } = input
    const result = await dpkit.validatePackage(source)
    return result
  },
)
