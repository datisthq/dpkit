import type { Resource } from "@dpkit/core"
import { validateTable as validateTableLowLevel } from "@dpkit/table"
import { readTable } from "./read.js"

export async function validateTable(
  resource: Partial<Resource>,
  options?: { sampleSize?: number; invalidRowsLimit?: number },
) {
  const table = await readTable(resource, {
    dontProcess: true,
  })

  return await validateTableLowLevel(table, {
    schema: resource.schema,
    ...options,
  })
}
