import { saveFile } from "@dpkit/dataset"
import { resolveDialect } from "@dpkit/metadata"
import { utils, write } from "xlsx"
import type { SaveTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { denormalizeTable } from "../../../table/index.ts"
import type { Table } from "../../../table/index.ts"

export async function saveOdsTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const schema =
    options.schema ??
    (await inferSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, schema, {
    nativeTypes: ["boolean", "integer", "number", "string", "year"],
  })

  const frame = await table.collect()
  const dialect = await resolveDialect(options.dialect)
  const sheetName = dialect?.sheetName ?? "Sheet1"

  const sheet = utils.json_to_sheet(frame.toRecords())
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, sheetName)

  const buffer = write(book, { type: "buffer", bookType: "ods" })
  await saveFile(path, buffer, { overwrite })

  return path
}
