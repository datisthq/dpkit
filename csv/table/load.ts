import type { Dialect, Resource } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { Table } from "@dpkit/table"
import { DataFrame, col, scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { Utf8, concat } from "nodejs-polars"

export async function loadCsvTable(resource: Partial<Resource>) {
  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  const scanOptions = getScanOptions(resource, dialect)

  if (!firstPath) {
    return DataFrame().lazy()
  }

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

  if (dialect?.commentRows) {
    table = skipCommentRows(table, dialect.commentRows)
  }

  if (dialect?.skipInitialSpace) {
    table = stripInitialSpace(table)
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

function skipCommentRows(table: Table, commentRows: number[]) {
  return table
    .withRowCount()
    .withColumn(col("row_nr").add(1))
    .filter(col("row_nr").add(1).isIn(commentRows).not())
    .drop("row_nr")
}

function stripInitialSpace(table: Table) {
  return table.select(
    // TODO: rebase on stripCharsStart when it's fixed in polars
    // https://github.com/pola-rs/nodejs-polars/blob/51dc97fb5e77e55d69060d074ad5c365131b3f96/polars/lazy/expr/string.ts#L681C5-L681C20
    table.columns.map(name => col(name).str.strip().as(name)),
  )
}
