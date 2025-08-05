import type { Dialect, Resource } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { Table } from "@dpkit/table"
import { DataFrame, col, scanCSV } from "nodejs-polars"
import type { ScanCsvOptions } from "nodejs-polars"
import { Utf8, concat } from "nodejs-polars"

// TODO: Condier using sample to extract header first
// for better commentChar + headerRows/commentRows support
// (consult with the Data Package Working Group)

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

  if (dialect) {
    table = await joinHeaderRows(table, dialect)
    table = skipCommentRows(table, dialect)
    table = stripInitialSpace(table, dialect)
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

// TODO: move to the table package?

async function joinHeaderRows(table: Table, dialect: Dialect) {
  const headerOffset = getHeaderOffset(dialect)
  const headerRows = getHeaderRows(dialect)
  const headerJoin = dialect?.headerJoin ?? " "
  if (headerRows.length < 2) {
    return table
  }

  const extraLabelsFrame = await table
    .withRowCount()
    .withColumn(col("row_nr").add(1))
    .filter(col("row_nr").add(headerOffset).isIn(headerRows))
    .select(table.columns.map(name => col(name).str.concat(headerJoin)))
    .collect()

  const labels = table.columns
  const extraLabels = extraLabelsFrame.row(0)

  const mapping = Object.fromEntries(
    labels.map((label, index) => [
      label,
      [label, extraLabels[index]].join(headerJoin),
    ]),
  )

  return table
    .withRowCount()
    .withColumn(col("row_nr").add(1))
    .filter(col("row_nr").add(headerOffset).isIn(headerRows).not())
    .rename(mapping)
    .drop("row_nr")
}

function skipCommentRows(table: Table, dialect: Dialect) {
  const commentOffset = getCommentOffset(dialect)
  if (!dialect?.commentRows) {
    return table
  }

  return table
    .withRowCount()
    .withColumn(col("row_nr").add(1))
    .filter(col("row_nr").add(commentOffset).isIn(dialect.commentRows).not())
    .drop("row_nr")
}

function stripInitialSpace(table: Table, dialect: Dialect) {
  if (!dialect?.skipInitialSpace) {
    return table
  }

  return table.select(
    // TODO: rebase on stripCharsStart when it's fixed in polars
    // https://github.com/pola-rs/nodejs-polars/issues/336
    table.columns.map(name => col(name).str.strip().as(name)),
  )
}

function getRowsToSkip(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows[0] ? headerRows[0] - 1 : 0
}

function getHeaderOffset(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows.at(0) ?? 0
}

function getCommentOffset(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows.at(-1) ?? 0
}

function getHeaderRows(dialect?: Dialect) {
  return dialect?.header !== false ? (dialect?.headerRows ?? [1]) : []
}
