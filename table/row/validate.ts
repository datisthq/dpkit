import type { Schema } from "@dpkit/core"
import type { TableError } from "../error/Table.js"
import type { Table } from "../table/Table.js"
import { checkRowUnique } from "./checks/unique.js"

export function validateRows(schema: Schema, errorTable: Table) {
  const errors: TableError[] = []

  errorTable = checkRowUnique(schema, errorTable)

  return { errors, errorTable }
}
