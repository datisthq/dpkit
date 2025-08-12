import { Flags } from "@oclif/core"
import type { Dialect } from "dpkit"

// TODO: merge with dialect.ts

export const toHeader = Flags.boolean({
  description: "whether the file includes a header row with field names",
  default: true,
})

export const toHeaderRows = Flags.string({
  description:
    "comma-separated row numbers (zero-based) that are considered header rows",
})

export const toHeaderJoin = Flags.string({
  description: "character used to join multi-line headers",
})

export const toCommentRows = Flags.string({
  description: "comma-separated rows to be excluded from the data (zero-based)",
})

export const toCommentChar = Flags.string({
  description: "character sequence denoting the start of a comment line",
})

export const toDelimiter = Flags.string({
  description: "character used to separate fields in the data",
  char: "d",
})

export const toLineTerminator = Flags.string({
  description: "character sequence used to terminate rows",
})

export const toQuoteChar = Flags.string({
  description: "character used to quote fields",
})

export const toDoubleQuote = Flags.boolean({
  description:
    "whether a sequence of two quote characters represents a single quote",
})

export const toEscapeChar = Flags.string({
  description: "character used to escape the delimiter or quote characters",
})

export const toNullSequence = Flags.string({
  description:
    "character sequence representing null or missing values in the data",
})

export const toSkipInitialSpace = Flags.boolean({
  description:
    "whether to ignore whitespace immediately following the delimiter",
})

export const toProperty = Flags.string({
  description: "for JSON data, the property name containing the data array",
})

export const toItemType = Flags.string({
  description: "the type of data item in the source",
  options: ["array", "object"],
})

export const toItemKeys = Flags.string({
  description:
    "comma-separated object properties to extract as values (for object-based data items)",
})

export const toSheetNumber = Flags.integer({
  description: "for spreadsheet data, the sheet number to read (zero-based)",
})

export const toSheetName = Flags.string({
  description: "for spreadsheet data, the sheet name to read",
})

export const toTable = Flags.string({
  description: "for database sources, the table name to read",
})

export const toDialectOptions = {
  toDelimiter,
  toHeader,
  toHeaderRows,
  toHeaderJoin,
  toCommentRows,
  toCommentChar,
  toQuoteChar,
  toDoubleQuote,
  toEscapeChar,
  toNullSequence,
  toSkipInitialSpace,
  toProperty,
  toItemType,
  toItemKeys,
  toSheetNumber,
  toTable,
}

// TODO: rebase on types flags
export function createToDialectFromFlags(flags: any) {
  let dialect: Dialect | undefined

  if (flags.toDelimiter) {
    dialect = { ...dialect, delimiter: flags.toDelimiter }
  }

  if (flags.toHeader === false) {
    dialect = { ...dialect, header: flags.toHeader }
  }

  if (flags.toHeaderRows) {
    dialect = {
      ...dialect,
      headerRows: flags.toHeaderRows.split(",").map(Number),
    }
  }

  if (flags.toHeaderJoin) {
    dialect = { ...dialect, headerJoin: flags.toHeaderJoin }
  }

  if (flags.toCommentRows) {
    dialect = {
      ...dialect,
      commentRows: flags.toCommentRows.split(",").map(Number),
    }
  }

  if (flags.toCommentChar) {
    dialect = { ...dialect, commentChar: flags.toCommentChar }
  }

  if (flags.toQuoteChar) {
    dialect = { ...dialect, quoteChar: flags.toQuoteChar }
  }

  if (flags.toDoubleQuote) {
    dialect = { ...dialect, doubleQuote: flags.toDoubleQuote }
  }

  if (flags.toEscapeChar) {
    dialect = { ...dialect, escapeChar: flags.toEscapeChar }
  }

  if (flags.toNullSequence) {
    dialect = { ...dialect, nullSequence: flags.toNullSequence }
  }

  if (flags.toSkipInitialSpace) {
    dialect = { ...dialect, skipInitialSpace: flags.toSkipInitialSpace }
  }

  if (flags.toProperty) {
    dialect = { ...dialect, property: flags.toProperty }
  }

  if (flags.toItemType) {
    dialect = { ...dialect, itemType: flags.toItemType }
  }

  if (flags.toItemKeys) {
    dialect = { ...dialect, itemKeys: flags.toItemKeys.split(",") }
  }

  if (flags.toSheetNumber) {
    dialect = { ...dialect, sheetNumber: flags.toSheetNumber }
  }

  if (flags.toTable) {
    dialect = { ...dialect, table: flags.toTable }
  }

  return dialect
}
