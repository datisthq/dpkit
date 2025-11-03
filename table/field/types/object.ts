import type { ObjectField } from "@dpkit/core"
import type { Table } from "../../table/index.ts"
import { inspectJsonField } from "./json.ts"

export async function inspectObjectField(field: ObjectField, table: Table) {
  return inspectJsonField(field, table)
}
