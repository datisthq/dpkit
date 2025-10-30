import type { GeojsonField } from "@dpkit/core"
import type { Table } from "../../table/index.ts"
import { validateJsonField } from "./json.ts"

export async function validateGeojsonField(field: GeojsonField, table: Table) {
  return validateJsonField(field, table)
}
