import { assertLocalPathVacant } from "@dpkit/file"
import { denormalizeTable, inferSchemaFromTable } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"

export async function saveParquetTable(
  table: Table,
  options: SaveTableOptions,
) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const schema =
    options.schema ??
    (await inferSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, schema, {
    nativeTypes: [
      "boolean",
      "datetime",
      "integer",
      "list",
      "number",
      "string",
      "year",
    ],
  })

  await table
    .sinkParquet(path, {
      maintainOrder: true,
    })
    .collect()

  return path
}
