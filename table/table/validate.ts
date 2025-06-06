import type { Schema } from "@dpkit/core"
import { validateColumn } from "../column/index.js"
import type { Table } from "./Table.js"

export async function validateTable(props: {
  table: Table
  schema: Schema
}) {
  const { table, schema } = props

  console.log(table, schema, validateColumn)
}
