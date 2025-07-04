import type { SaveTableOptions, Table } from "@dpkit/table"
import { dpkit } from "../plugin.js"

export async function saveTable(table: Table, options: SaveTableOptions) {
  for (const plugin of dpkit.plugins) {
    const path = await plugin.saveTable?.(table, options)
    if (path) {
      return path
    }
  }

  throw new Error(`No plugin can save the table to the path: ${options.path}`)
}
