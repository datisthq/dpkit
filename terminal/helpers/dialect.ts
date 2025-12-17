import type { Dialect } from "frictionless-ts"

// TODO: Find a better way to construct dialects

export function createDialectFromOptions(options: any) {
  let dialect: Dialect | undefined

  if (options.delimiter) {
    dialect = { ...dialect, delimiter: options.delimiter }
  }

  if (options.header === false) {
    dialect = { ...dialect, header: options.header }
  }

  if (options.headerRows) {
    dialect = {
      ...dialect,
      headerRows: options.headerRows.split(",").map(Number),
    }
  }

  if (options.headerJoin) {
    dialect = { ...dialect, headerJoin: options.headerJoin }
  }

  if (options.commentRows) {
    dialect = {
      ...dialect,
      commentRows: options.commentRows.split(",").map(Number),
    }
  }

  if (options.commentChar) {
    dialect = { ...dialect, commentChar: options.commentChar }
  }

  if (options.quoteChar) {
    dialect = { ...dialect, quoteChar: options.quoteChar }
  }

  if (options.doubleQuote) {
    dialect = { ...dialect, doubleQuote: options.doubleQuote }
  }

  if (options.escapeChar) {
    dialect = { ...dialect, escapeChar: options.escapeChar }
  }

  if (options.nullSequence) {
    dialect = { ...dialect, nullSequence: options.nullSequence }
  }

  if (options.skipInitialSpace) {
    dialect = { ...dialect, skipInitialSpace: options.skipInitialSpace }
  }

  if (options.property) {
    dialect = { ...dialect, property: options.property }
  }

  if (options.itemType) {
    dialect = { ...dialect, itemType: options.itemType }
  }

  if (options.itemKeys) {
    dialect = { ...dialect, itemKeys: options.itemKeys.split(",") }
  }

  if (options.sheetNumber) {
    dialect = { ...dialect, sheetNumber: options.sheetNumber }
  }

  if (options.sheetName) {
    dialect = { ...dialect, sheetName: options.sheetName }
  }

  if (options.table) {
    dialect = { ...dialect, table: options.table }
  }

  return dialect
}

export function createToDialectFromOptions(options: any) {
  let dialect: Dialect | undefined

  if (options.toDelimiter) {
    dialect = { ...dialect, delimiter: options.toDelimiter }
  }

  if (options.toHeader === false) {
    dialect = { ...dialect, header: options.toHeader }
  }

  if (options.toHeaderRows) {
    dialect = {
      ...dialect,
      headerRows: options.toHeaderRows.split(",").map(Number),
    }
  }

  if (options.toHeaderJoin) {
    dialect = { ...dialect, headerJoin: options.toHeaderJoin }
  }

  if (options.toCommentRows) {
    dialect = {
      ...dialect,
      commentRows: options.toCommentRows.split(",").map(Number),
    }
  }

  if (options.toCommentChar) {
    dialect = { ...dialect, commentChar: options.toCommentChar }
  }

  if (options.toQuoteChar) {
    dialect = { ...dialect, quoteChar: options.toQuoteChar }
  }

  if (options.toDoubleQuote) {
    dialect = { ...dialect, doubleQuote: options.toDoubleQuote }
  }

  if (options.toEscapeChar) {
    dialect = { ...dialect, escapeChar: options.toEscapeChar }
  }

  if (options.toNullSequence) {
    dialect = { ...dialect, nullSequence: options.toNullSequence }
  }

  if (options.toSkipInitialSpace) {
    dialect = { ...dialect, skipInitialSpace: options.toSkipInitialSpace }
  }

  if (options.toProperty) {
    dialect = { ...dialect, property: options.toProperty }
  }

  if (options.toItemType) {
    dialect = { ...dialect, itemType: options.toItemType }
  }

  if (options.toItemKeys) {
    dialect = { ...dialect, itemKeys: options.toItemKeys.split(",") }
  }

  if (options.toSheetNumber) {
    dialect = { ...dialect, sheetNumber: options.toSheetNumber }
  }

  if (options.toSheetName) {
    dialect = { ...dialect, sheetName: options.toSheetName }
  }

  if (options.toTable) {
    dialect = { ...dialect, table: options.toTable }
  }

  return dialect
}
