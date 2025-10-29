import type { Dialect, Resource } from "@dpkit/core"
import { loadResourceDialect, loadResourceSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { Table } from "@dpkit/table"
import { inferSchemaFromTable, normalizeTable } from "@dpkit/table"
import { stripInitialSpace } from "@dpkit/table"
import { joinHeaderRows } from "@dpkit/table"
import { skipCommentRows } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { concat } from "nodejs-polars"
import { inferCsvDialect } from "../dialect/index.ts"

// TODO: Condier using sample to extract header first
// for better commentChar + headerRows/commentRows support
// (consult with the Data Package Working Group)

export async function loadCsvTable(
  resource: Partial<Resource> & { format?: "csv" | "tsv" },
  options?: LoadTableOptions,
) {
  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  let dialect = await loadResourceDialect(resource.dialect)
  if (!dialect) {
    dialect = await inferCsvDialect({ ...resource, path: paths[0] }, options)
  }

  const scanOptions = getScanOptions(resource, dialect)
  const tables: Table[] = []
  for (const path of paths) {
    const table = scanCSV(path, scanOptions)
    tables.push(table)
  }

  // There is no way to specify column names in nodejs-polars by default
  // so we have to rename `column_*` to `field*` is table doesn't have header
  let table = concat(tables)
  if (!scanOptions.hasHeader) {
    table = table.rename(
      Object.fromEntries(
        table.columns.map(name => [name, name.replace("column_", "field")]),
      ),
    )
  }

  if (dialect) {
    table = await joinHeaderRows(table, { dialect })
    table = skipCommentRows(table, { dialect })
    table = stripInitialSpace(table, { dialect })
  }

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}

function getScanOptions(resource: Partial<Resource>, dialect?: Dialect) {
  const options: Partial<ScanCsvOptions> = {
    inferSchemaLength: 0,
    truncateRaggedLines: true,
  }

  if (resource.encoding) {
    options.encoding = resource.encoding

    // Polars supports only utf-8 and utf-8-lossy encodings
    if (options.encoding === "utf-8") {
      options.encoding = "utf8"
    }

    if (options.encoding !== "utf8") {
      throw new Error(`Encoding ${options.encoding} for CSV files is not supported`)
    }
  }

  options.skipRows = getRowsToSkip(dialect)
  options.hasHeader = dialect?.header !== false
  options.eolChar = dialect?.lineTerminator ?? "\n"
  options.sep = dialect?.delimiter ?? ","

  // TODO: try convincing nodejs-polars to support escapeChar
  // https://github.com/pola-rs/polars/issues/3074
  //options.escapeChar = dialect?.escapeChar

  options.quoteChar = dialect?.quoteChar ?? '"'
  options.nullValues = dialect?.nullSequence

  // TODO: try convincing nodejs-polars to support doubleQuote
  //options.doubleQuote = dialect?.doubleQuote ?? true

  // TODO: remove ts-ignore when issues is fixed
  // https://github.com/pola-rs/nodejs-polars/issues/334
  // @ts-ignore
  options.commentPrefix = dialect?.commentChar

  return options
}

function getRowsToSkip(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows[0] ? headerRows[0] - 1 : 0
}

function getHeaderRows(dialect?: Dialect) {
  return dialect?.header !== false ? (dialect?.headerRows ?? [1]) : []
}
