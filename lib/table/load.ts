import type { Resource } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import { dpkit } from "../plugin.ts"

export async function loadTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  for (const plugin of dpkit.plugins) {
    const table = await plugin.loadTable?.(resource, options)
    if (table) {
      return table
    }
  }

  return undefined
}
