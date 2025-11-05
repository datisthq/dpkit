import type { SavePackageOptions } from "@dpkit/dataset"
import type { Package } from "@dpkit/metadata"
import { resolveSchema } from "@dpkit/metadata"
import { isRemoteResource } from "@dpkit/metadata"
import type { TablePlugin } from "@dpkit/table"
import type { DatabaseFormat } from "../resource/index.ts"
import { saveDatabaseTable } from "../table/index.ts"

export async function savePackageToDatabase(
  dataPackage: Package,
  options: SavePackageOptions & {
    format: DatabaseFormat
    plugins?: TablePlugin[]
  },
) {
  for (const resource of dataPackage.resources) {
    for (const plugin of options.plugins ?? []) {
      const isRemote = isRemoteResource(resource)
      if (isRemote && !options.withRemote) {
        continue
      }

      const table = await plugin.loadTable?.(resource)

      if (table) {
        const dialect = { table: resource.name }
        const schema = await resolveSchema(resource.schema)

        // TODO: support parallel saving?
        await saveDatabaseTable(table, {
          path: options.target,
          format: options.format,
          dialect,
          schema,
        })

        break
      }
    }
  }

  return { path: options.target }
}
