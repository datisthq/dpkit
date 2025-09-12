import type { Schema } from "@dpkit/core"
import type { TableError } from "../error/Table.ts"
import type { Table } from "../table/Table.ts"
import { checkRowUnique } from "./checks/unique.ts"

export function validateRows(schema: Schema, errorTable: Table) {
  const errors: TableError[] = []

  errorTable = checkRowUnique(schema, errorTable)

  return { errors, errorTable }
}
