import type { Resource } from "@dpkit/core"
import { validateTable } from "@dpkit/table"
import { readCsvTable } from "./read.js"

export async function validateCsvTable(
  resource: Partial<Resource>,
  options?: { sampleSize?: number; invalidRowsLimit?: number },
) {
  const table = await readCsvTable(resource, {
    dontProcess: true,
    sampleSize: options?.sampleSize,
  })

  return await validateTable(table, { schema: resource.schema, ...options })
}
