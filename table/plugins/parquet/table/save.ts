import { assertLocalPathVacant } from "@dpkit/file"
import type { SaveTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { denormalizeTable } from "../../../table/index.ts"
import type { Table } from "../../../table/index.ts"

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
