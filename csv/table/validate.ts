import type { Resource } from "@dpkit/core"
import { validateTable } from "@dpkit/table"
import { readCsvTable } from "./read.js"

export async function validateCsvTable(resource: Partial<Resource>) {
  const table = await readCsvTable(resource, { dontProcess: true })
  return await validateTable(table, { schema: resource.schema })
}
