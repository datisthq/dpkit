import { assertLocalPathVacant } from "@dpkit/file"
import { denormalizeTable, inferSchemaFromTable } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: rebase on sinkIPC when it is available
// https://github.com/pola-rs/nodejs-polars/issues/353

export async function saveArrowTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const schema = await inferSchemaFromTable(table, {
    ...options,
    keepStrings: true,
  })

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

  const df = await table.collect()
  df.writeIPC(path)

  return path
}
