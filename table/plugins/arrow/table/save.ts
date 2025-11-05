import { assertLocalPathVacant } from "@dpkit/dataset"
import type { SaveTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { denormalizeTable } from "../../../table/index.ts"
import type { Table } from "../../../table/index.ts"

// TODO: rebase on sinkIPC when it is available
// https://github.com/pola-rs/nodejs-polars/issues/353

export async function saveArrowTable(table: Table, options: SaveTableOptions) {
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

  const frame = await table.collect()
  frame.writeIPC(path)

  return path
}
