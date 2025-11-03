import { resolveDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import { loadFile, prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchemaFromTable, normalizeTable } from "@dpkit/table"
import type { DataRow, Table } from "@dpkit/table"
import { getRecordsFromRows } from "@dpkit/table"
import * as pl from "nodejs-polars"
import { read, utils } from "xlsx"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadXlsxTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  const dialect = await resolveDialect(resource.dialect)

  const tables: Table[] = []
  for (const path of paths) {
    const buffer = await loadFile(path)

    const book = read(buffer, { type: "buffer" })
    const sheetIndex = dialect?.sheetNumber ? dialect.sheetNumber - 1 : 0
    const sheetName = dialect?.sheetName ?? book.SheetNames[sheetIndex]
    const sheet = sheetName ? book.Sheets[sheetName] : undefined

    if (sheet) {
      const rows = utils.sheet_to_json(sheet, {
        header: 1,
        raw: true,
      }) as DataRow[]

      const records = getRecordsFromRows(rows, dialect)
      const table = pl.DataFrame(records).lazy()

      tables.push(table)
    }
  }

  let table = pl.concat(tables)

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
