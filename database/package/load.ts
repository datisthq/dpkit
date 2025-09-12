import type { Package } from "@dpkit/core"
import { createDriver } from "../drivers/create.ts"
import type { DatabaseFormat } from "../resource/index.ts"

export async function loadPackageFromDatabase(
  connectionString: string,
  options: { format: DatabaseFormat },
) {
  const driver = createDriver(options.format)
  const database = await driver.connectDatabase(connectionString)
  const databaseSchemas = await database.introspection.getTables()

  const datapackage: Package = {
    resources: [],
  }

  for (const databaseSchema of databaseSchemas) {
    const schema = driver.normalizeSchema(databaseSchema)
    const dialect = { table: databaseSchema.name }

    datapackage.resources.push({
      name: databaseSchema.name,
      format: options.format,
      dialect,
      schema,
    })
  }

  return datapackage
}
