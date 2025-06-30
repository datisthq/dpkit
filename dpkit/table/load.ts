import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { dpkit } from "../plugin.js"

export async function loadTable(resource: Partial<Resource>): Promise<Table> {
  for (const plugin of dpkit.plugins) {
    const table = await plugin.loadTable?.(resource)
    if (table) {
      return table
    }
  }

  throw new Error(`No plugin can load the table: ${resource}`)
}
