import type { SaveTableOptions, Table } from "@dpkit/table"
import { system } from "../system.ts"

export async function saveTable(table: Table, options: SaveTableOptions) {
  for (const plugin of system.plugins) {
    const path = await plugin.saveTable?.(table, options)
    if (path) {
      return path
    }
  }

  throw new Error(`No plugin can save the table: ${options.path}`)
}
