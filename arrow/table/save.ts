import { assertLocalPathVacant } from "@dpkit/file"
import { denormalizeTable, inferTableSchema } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: rebase on sinkIPC when it is available
// https://github.com/pola-rs/nodejs-polars/issues/353

export async function saveArrowTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const schema = await inferTableSchema(table, {
    ...options,
    keepStrings: true,
  })

  table = await denormalizeTable(table, schema, {
    keepTypes: [
      "string",
      "integer",
      "number",
      "boolean",
      "datetime",
      "year",
      "list",
    ],
  })

  const df = await table.collect()
  df.writeIPC(path)

  return path
}
