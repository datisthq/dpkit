import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { processTable } from "@dpkit/table"
import { inferTable } from "./infer.js"

export async function readTable(resource: Partial<Resource>): Promise<Table> {
  const { table, schema } = await inferTable(resource)
  return await processTable(table, { schema })
}
