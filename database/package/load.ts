import type { Package } from "@dpkit/core"
import { createAdapter } from "../adapters/create.ts"
import type { DatabaseFormat } from "../resource/index.ts"

export async function loadPackageFromDatabase(
  connectionString: string,
  options: { format: DatabaseFormat },
) {
  const adapter = createAdapter(options.format)
  const database = await adapter.connectDatabase(connectionString)
  const databaseSchemas = await database.introspection.getTables()

  const datapackage: Package = {
    resources: [],
  }

  for (const databaseSchema of databaseSchemas) {
    const schema = adapter.normalizeSchema(databaseSchema)
    const dialect = { table: databaseSchema.name }

    datapackage.resources.push({
      path: connectionString,
      name: databaseSchema.name,
      format: options.format,
      dialect,
      schema,
    })
  }

  return datapackage
}
