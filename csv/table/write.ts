import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"

export function writeCsvTable(table: Table, options?: { resource: Resource }) {
  return { table, options }
}
