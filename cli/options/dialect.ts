import { Flags } from "@oclif/core"
import type { Dialect } from "dpkit"

export const header = Flags.boolean({
  description: "whether the file includes a header row with field names",
  default: true,
})

export const headerRows = Flags.string({
  description:
    "comma-separated row numbers (zero-based) that are considered header rows",
})

export const headerJoin = Flags.string({
  description: "character used to join multi-line headers",
})

export const commentRows = Flags.string({
  description: "comma-separated rows to be excluded from the data (zero-based)",
})

export const commentChar = Flags.string({
  description: "character sequence denoting the start of a comment line",
})

export const delimiter = Flags.string({
  description: "character used to separate fields in the data",
  char: "d",
})

export const lineTerminator = Flags.string({
  description: "character sequence used to terminate rows",
})

export const quoteChar = Flags.string({
  description: "character used to quote fields",
})

export const doubleQuote = Flags.boolean({
  description:
    "whether a sequence of two quote characters represents a single quote",
})

export const escapeChar = Flags.string({
  description: "character used to escape the delimiter or quote characters",
})

export const nullSequence = Flags.string({
  description:
    "character sequence representing null or missing values in the data",
})

export const skipInitialSpace = Flags.boolean({
  description:
    "whether to ignore whitespace immediately following the delimiter",
})

export const property = Flags.string({
  description: "for JSON data, the property name containing the data array",
})

export const itemType = Flags.string({
  description: "the type of data item in the source",
  options: ["array", "object"],
})

export const itemKeys = Flags.string({
  description:
    "comma-separated object properties to extract as values (for object-based data items)",
})

export const sheetNumber = Flags.integer({
  description: "for spreadsheet data, the sheet number to read (zero-based)",
})

export const sheetName = Flags.string({
  description: "for spreadsheet data, the sheet name to read",
})

export const table = Flags.string({
  description: "for database sources, the table name to read",
})

export const dialectOptions = {
  delimiter,
  header,
  headerRows,
  headerJoin,
  commentRows,
  commentChar,
  quoteChar,
  doubleQuote,
  escapeChar,
  nullSequence,
  skipInitialSpace,
  property,
  itemType,
  itemKeys,
  sheetNumber,
  table,
}

// TODO: rebase on types flags
export function createDialectFromFlags(flags: any) {
  let dialect: Dialect | undefined

  if (flags.delimiter) {
    dialect = { ...dialect, delimiter: flags.delimiter }
  }

  if (flags.header === false) {
    dialect = { ...dialect, header: flags.header }
  }

  if (flags.headerRows) {
    dialect = {
      ...dialect,
      headerRows: flags.headerRows.split(",").map(Number),
    }
  }

  if (flags.headerJoin) {
    dialect = { ...dialect, headerJoin: flags.headerJoin }
  }

  if (flags.commentRows) {
    dialect = {
      ...dialect,
      commentRows: flags.commentRows.split(",").map(Number),
    }
  }

  if (flags.commentChar) {
    dialect = { ...dialect, commentChar: flags.commentChar }
  }

  if (flags.quoteChar) {
    dialect = { ...dialect, quoteChar: flags.quoteChar }
  }

  if (flags.doubleQuote) {
    dialect = { ...dialect, doubleQuote: flags.doubleQuote }
  }

  if (flags.escapeChar) {
    dialect = { ...dialect, escapeChar: flags.escapeChar }
  }

  if (flags.nullSequence) {
    dialect = { ...dialect, nullSequence: flags.nullSequence }
  }

  if (flags.skipInitialSpace) {
    dialect = { ...dialect, skipInitialSpace: flags.skipInitialSpace }
  }

  if (flags.property) {
    dialect = { ...dialect, property: flags.property }
  }

  if (flags.itemType) {
    dialect = { ...dialect, itemType: flags.itemType }
  }

  if (flags.itemKeys) {
    dialect = { ...dialect, itemKeys: flags.itemKeys.split(",") }
  }

  if (flags.sheetNumber) {
    dialect = { ...dialect, sheetNumber: flags.sheetNumber }
  }

  if (flags.table) {
    dialect = { ...dialect, table: flags.table }
  }

  return dialect
}
