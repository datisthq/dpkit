import type { Package } from "@dpkit/core"
import { createAdapter } from "../adapters/create.ts"
import type { DatabaseFormat } from "../resource/index.ts"

export async function loadPackageFromDatabase(
  connectionString: string,
  options: {
    format: DatabaseFormat
    includeTables?: string[]
    excludeTables?: string[]
  },
) {
  const { includeTables, excludeTables } = options

  const adapter = createAdapter(options.format)
  const database = await adapter.connectDatabase(connectionString)
  const databaseSchemas = await database.introspection.getTables()

  const dataPackage: Package = {
    resources: [],
  }

  for (const databaseSchema of databaseSchemas) {
    const name = databaseSchema.name

    if (includeTables && !includeTables.includes(name)) {
      continue
    }

    if (excludeTables?.includes(name)) {
      continue
    }

    const schema = adapter.normalizeSchema(databaseSchema)
    const dialect = { table: name }

    dataPackage.resources.push({
      name,
      path: connectionString,
      format: options.format,
      dialect,
      schema,
    })
  }

  return dataPackage
}
