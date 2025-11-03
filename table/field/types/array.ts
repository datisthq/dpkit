import type { ArrayField } from "@dpkit/core"
import type { Table } from "../../table/index.ts"
import { inspectJsonField } from "./json.ts"

export async function inspectArrayField(field: ArrayField, table: Table) {
  return inspectJsonField(field, table)
}
