import type { Resource } from "@dpkit/core"
import type { LoadTableOptions, Table } from "@dpkit/table"
import { dpkit } from "../plugin.ts"

export async function loadTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
): Promise<Table> {
  for (const plugin of dpkit.plugins) {
    const table = await plugin.loadTable?.(resource, options)
    if (table) {
      return table
    }
  }

  throw new Error(`No plugin can load the table: ${resource}`)
}
