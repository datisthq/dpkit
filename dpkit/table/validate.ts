import type { Resource } from "@dpkit/core"
import { dpkit } from "../general/index.js"

export async function validateTable(resource: Partial<Resource>) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.validateTable?.(resource)
    if (result) return result
  }

  throw new Error(`No plugin can validate the table: ${resource}`)
}
