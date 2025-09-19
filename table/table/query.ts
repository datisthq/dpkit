import { SQLContext } from "nodejs-polars"
import type { Table } from "./Table.ts"

export function queryTable(table: Table, query: string) {
  const context = SQLContext({ self: table })
  return context.execute(query)
}
