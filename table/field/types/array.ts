import type { ArrayField } from "@dpkit/core"
import type { Table } from "../../table/index.ts"
import { validateJsonField } from "./json.ts"

export async function validateArrayField(field: ArrayField, table: Table) {
  return validateJsonField(field, table)
}
