import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { dpkit } from "../general/index.js"

export async function readTable(resource: Partial<Resource>): Promise<Table> {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.readTable?.(resource)
    if (result) return result
  }

  throw new Error(`No plugin can read the table: ${resource}`)
}
