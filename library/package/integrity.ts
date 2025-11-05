import type { Package } from "@dpkit/metadata"
import { createReport } from "@dpkit/metadata"
import { resolveSchema } from "@dpkit/metadata"
import type { BoundError } from "@dpkit/metadata"
import type { Table } from "@dpkit/table"
import { loadTable } from "../table/index.ts"

// TODO: foreign key fields definition should be validated as well (metadata/here?)
// TODO: review temporary files creation from validatePackage call

export async function validatePackageIntegrity(
  dataPackage: Package,
  options?: { maxErrors?: number },
) {
  const { maxErrors = 1000 } = options ?? {}

  const errors: BoundError[] = []
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
          resource: name,
        })

        continue
      }

      if (!tables[name]) {
        const table = await loadTable(resource)

        if (!table) {
          errors.push({
            type: "data",
            message: `missing ${resource.name} table`,
            resource: name,
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
          resource: resource.name,
        })
      }
    }
  }

  return createReport(errors, { maxErrors })
}
