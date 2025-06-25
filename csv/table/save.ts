import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"

export function saveCsvTable(table: Table, options?: { resource: Resource }) {
  return { table, options }
}
