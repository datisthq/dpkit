import type { ObjectField } from "@dpkit/core"
import type { Table } from "../../table/index.ts"
import { validateJsonField } from "./json.ts"

export async function validateObjectField(field: ObjectField, table: Table) {
  return validateJsonField(field, table)
}
