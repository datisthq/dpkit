import type { Resource } from "@dpkit/metadata"
import type { LoadTableOptions } from "@dpkit/table"
import { system } from "../system.ts"

export async function loadTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  for (const plugin of system.plugins) {
    const table = await plugin.loadTable?.(resource, options)
    if (table) {
      return table
    }
  }

  return undefined
}
