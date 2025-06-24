import type { Resource } from "@dpkit/core"
import { validateTable } from "@dpkit/table"
import { readInlineTable } from "./read.js"

export async function validateInlineTable(
  resource: Partial<Resource>,
  options?: { sampleSize?: number; invalidRowsLimit?: number },
) {
  const table = await readInlineTable(resource, {
    dontProcess: true,
    sampleSize: options?.sampleSize,
  })

  return await validateTable(table, { schema: resource.schema, ...options })
}
