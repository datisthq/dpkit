import { loadResourceDialect } from "@dpkit/core"
import { saveFile } from "@dpkit/file"
import { denormalizeTable, inferTableSchema } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { utils, write } from "xlsx"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function saveXlsxTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  const schema = await inferTableSchema(table, {
    ...options,
    keepStrings: true,
  })

  table = await denormalizeTable(table, schema, {
    nativeTypes: ["boolean", "integer", "number", "string", "year"],
  })

  const df = await table.collect()
  const dialect = await loadResourceDialect(options.dialect)
  const sheetName = dialect?.sheetName ?? "Sheet1"

  const sheet = utils.json_to_sheet(df.toRecords())
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, sheetName)

  const buffer = write(book, { type: "buffer", bookType: "xlsx" })
  await saveFile(path, buffer, { overwrite })

  return path
}
