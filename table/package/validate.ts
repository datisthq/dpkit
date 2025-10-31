import type { Package, Resource } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import type { DataError } from "@dpkit/core"
import type { ForeignKeyError } from "../error/index.ts"
import type { Table } from "../table/Table.ts"

// TODO: foreign key fields definition should be validated as well (metadata/here?)
// TODO: review temporary files creation from validatePackage call

export async function validatePackageForeignKeys(
  dataPackage: Package,
  options: {
    maxErrors?: number
    loadTable: (resource: Resource) => Promise<Table>
  },
) {
  const { loadTable, maxErrors = 1000 } = options

  const errors: (DataError | ForeignKeyError)[] = []
  const tables: Record<string, Table> = {}

  for (const resource of dataPackage.resources) {
    const schema = await resolveSchema(resource.schema)
    if (!schema) continue

    const foreignKeys = schema.foreignKeys
    if (!foreignKeys) continue

    const names = [
      resource.name,
      ...foreignKeys.map(it => it.reference.resource),
    ].filter(Boolean) as string[]

    for (const name of names) {
      const resource = dataPackage.resources.find(r => r.name === name)

      if (!resource) {
        errors.push({
          type: "data",
          message: `missing ${name} resource`,
        })

        continue
      }

      if (!tables[name]) {
        const table = await loadTable(resource)

        if (!table) {
          errors.push({
            type: "data",
            message: `missing ${resource.name} table`,
          })

          continue
        }

        tables[name] = table
      }
    }

    for (const foreignKey of foreignKeys) {
      const left = tables[resource.name] as Table
      const right = tables[
        foreignKey.reference.resource ?? resource.name
      ] as Table

      const foreignKeyCheckTable = left
        .select(...foreignKey.fields)
        .join(right, {
          how: "anti",
          leftOn: foreignKey.fields,
          rightOn: foreignKey.reference.fields,
        })

      const foreignKeyCheckFrame = await foreignKeyCheckTable
        .head(maxErrors)
        .collect()

      for (const row of foreignKeyCheckFrame.toRecords() as any[]) {
        errors.push({
          type: "foreignKey",
          foreignKey,
          cells: Object.values(row).map(String),
        })
      }
    }
  }

  return {
    errors: errors.slice(0, maxErrors),
    valid: errors.length === 0,
  }
}
