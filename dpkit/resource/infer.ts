import type { Resource } from "@dpkit/core"
import { inferTable } from "../table/index.ts"

// TODO: Implement properly

export async function inferResource(resource: Partial<Resource>) {
  const { dialect, schema } = await inferTable(resource)

  return { ...resource, dialect, schema }
}
