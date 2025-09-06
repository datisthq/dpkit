import type { Dialect, Resource } from "@dpkit/core"
import { loadResourceDialect, loadResourceSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { inferTableSchema, normalizeTable } from "@dpkit/table"
import { stripInitialSpace } from "@dpkit/table"
import { joinHeaderRows } from "@dpkit/table"
import { skipCommentRows } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { Utf8, concat } from "nodejs-polars"
import { inferCsvDialect } from "../dialect/index.ts"

// TODO: Condier using sample to extract header first
// for better commentChar + headerRows/commentRows support
// (consult with the Data Package Working Group)

// TODO: support providing TSV format? (see JSON)

export async function loadCsvTable(
  resource: Partial<Resource> & { format?: "csv" | "tsv" },
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let dialect = await loadResourceDialect(resource.dialect)
  if (!dialect) dialect = await inferCsvDialect(resource, options)

  const scanOptions = getScanOptions(resource, dialect)
  let table = scanCSV(firstPath, scanOptions)

  const polarsSchema = Object.fromEntries(
    table.columns.map(name => [name, Utf8]),
  )

  if (restPaths.length) {
    table = concat([
      table,
      ...restPaths.map(path =>
        scanCSV(path, {
          ...scanOptions,
          hasHeader: false,
          schema: polarsSchema,
        }),
      ),
    ])
  }

  if (dialect) {
    table = await joinHeaderRows(table, { dialect })
    table = skipCommentRows(table, { dialect })
    table = stripInitialSpace(table, { dialect })
  }

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferTableSchema(table, options)
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
  }

  options.skipRows = getRowsToSkip(dialect)
  options.hasHeader = dialect?.header !== false
  options.sep = dialect?.delimiter ?? ","

  // TODO: enable after this polars issues is fixed
  // https://github.com/pola-rs/nodejs-polars/issues/333
  //options.eolChar = dialect?.lineTerminator ?? "\n"

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
