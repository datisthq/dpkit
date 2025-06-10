import type { Resource } from "@dpkit/core"
import { validateTable } from "@dpkit/table"
import { readInlineTable } from "./read.js"

export async function validateInlineTable(resource: Resource) {
  const table = await readInlineTable(resource, { dontProcess: true })
  return await validateTable(table, { schema: resource.schema })
}
