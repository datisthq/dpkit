import * as pl from "nodejs-polars"
import type { Table } from "./Table.ts"

export function queryTable(table: Table, query: string) {
  const context = pl.SQLContext({ self: table })
  return context.execute(query)
}
