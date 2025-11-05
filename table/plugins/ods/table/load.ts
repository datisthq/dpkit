import { resolveDialect } from "@dpkit/metadata"
import type { Resource } from "@dpkit/metadata"
import { resolveSchema } from "@dpkit/metadata"
import { loadFile, prefetchFiles } from "@dpkit/dataset"
import type { DataRow } from "../../../data/index.ts"
import { getRecordsFromRows } from "../../../data/index.ts"
import type { LoadTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { normalizeTable } from "../../../table/index.ts"
import type { Table } from "../../../table/index.ts"
import * as pl from "nodejs-polars"
import { read, utils } from "xlsx"

export async function loadOdsTable(
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
