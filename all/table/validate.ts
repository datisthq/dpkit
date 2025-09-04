import type { Resource } from "@dpkit/core"
import { inspectTable } from "@dpkit/table"
import { inferTable } from "./infer.ts"

// TODO: Merge with validateResource? (will free validateTable name)

export async function validateTable(resource: Partial<Resource>) {
  const { table, schema } = await inferTable(resource)
  const errors = await inspectTable(table, { schema })

  const valid = errors.length === 0
  return { valid, errors }
}
