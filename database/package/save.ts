import type { Package } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { isRemoteResource } from "@dpkit/core"
import type { SavePackageOptions } from "@dpkit/core"
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
        const schema = await loadResourceSchema(resource.schema)

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
