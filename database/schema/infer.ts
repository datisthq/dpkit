import type { Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"

export async function inferDatabaseSchema(resource: Partial<Resource>) {
  const dialect = await loadResourceDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }
}
