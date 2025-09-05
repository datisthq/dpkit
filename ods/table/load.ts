import { loadResourceDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { loadFile, prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { normalizeTable, reflectTable } from "@dpkit/table"
import type { DataRow, Table } from "@dpkit/table"
import { getRecordsFromRows } from "@dpkit/table"
import { DataFrame, concat } from "nodejs-polars"
import { read, utils } from "xlsx"

export async function loadOdsTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  const dialect = await loadResourceDialect(resource.dialect)

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
      const table = DataFrame(records).lazy()

      tables.push(table)
    }
  }

  let table = concat(tables)

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await reflectTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
