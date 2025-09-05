import type { Schema } from "@dpkit/core"
import type { Table } from "./Table.ts"

//const HEAD_ROWS = 100

export async function denormalizeTable(
  table: Table,
  schema: Schema,
  //options?: {},
) {
  console.log(table)
  console.log(schema)
  return table
}
