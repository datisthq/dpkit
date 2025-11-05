import type { ArrayField } from "@dpkit/metadata"
import type { Table } from "../../table/index.ts"
import { inspectJsonField } from "./json.ts"

export async function inspectArrayField(field: ArrayField, table: Table) {
  return inspectJsonField(field, table)
}
