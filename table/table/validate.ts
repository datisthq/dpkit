import type { Schema } from "@dpkit/core"
import type { Table } from "./Table.js"

export async function validateTable(props: {
  table: Table
  schema: Schema
}) {
  console.log(props)
}
