import type { Resource } from "@dpkit/metadata"
import type { UnboundError } from "@dpkit/metadata"
import { resolveSchema } from "@dpkit/metadata"
import { createReport } from "@dpkit/metadata"
import { inspectTable } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchema } from "../schema/index.ts"
import { loadTable } from "./load.ts"

export async function validateTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions & { maxErrors?: number },
) {
  const { maxErrors } = options ?? {}

  const errors: UnboundError[] = []
  const table = await loadTable(resource, { denormalized: true })

  if (table) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchema(resource, options)
    const tableErrors = await inspectTable(table, { schema, maxErrors })
    errors.push(...tableErrors)
  }

  // TODO: review
  if (!table && resource.schema) {
    errors.push({
      type: "data",
      message: `missing ${resource.name} table`,
    })
  }

  return createReport(errors, { maxErrors })
}
