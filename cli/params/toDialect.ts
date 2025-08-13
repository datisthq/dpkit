import { Option } from "commander"
import type { Dialect } from "dpkit"

export const toHeader = new Option(
  "--to-header",
  "whether the file includes a header row with field names",
).default(true)

export const toHeaderRows = new Option(
  "--to-header-rows <rows>",
  "comma-separated row numbers (zero-based) that are considered header rows",
)

export const toHeaderJoin = new Option(
  "--to-header-join <char>",
  "character used to join multi-line headers",
)

export const toCommentRows = new Option(
  "--to-comment-rows <rows>",
  "comma-separated rows to be excluded from the data (zero-based)",
)

export const toCommentChar = new Option(
  "--to-comment-char <char>",
  "character sequence denoting the start of a comment line",
)

export const toDelimiter = new Option(
  "--to-delimiter <char>",
  "character used to separate fields in the data",
)

export const toLineTerminator = new Option(
  "--to-line-terminator <char>",
  "character sequence used to terminate rows",
)

export const toQuoteChar = new Option(
  "--to-quote-char <char>",
  "character used to quote fields",
)

export const toDoubleQuote = new Option(
  "--to-double-quote",
  "whether a sequence of two quote characters represents a single quote",
)

export const toEscapeChar = new Option(
  "--to-escape-char <char>",
  "character used to escape the delimiter or quote characters",
)

export const toNullSequence = new Option(
  "--to-null-sequence <seq>",
  "character sequence representing null or missing values in the data",
)

export const toSkipInitialSpace = new Option(
  "--to-skip-initial-space",
  "whether to ignore whitespace immediately following the delimiter",
)

export const toProperty = new Option(
  "--to-property <name>",
  "for JSON data, the property name containing the data array",
)

export const toItemType = new Option(
  "--to-item-type <type>",
  "the type of data item in the source",
).choices(["array", "object"])

export const toItemKeys = new Option(
  "--to-item-keys <keys>",
  "comma-separated object properties to extract as values (for object-based data items)",
)

export const toSheetNumber = new Option(
  "--to-sheet-number <num>",
  "for spreadsheet data, the sheet number to read (zero-based)",
).argParser(Number.parseInt)

export const toSheetName = new Option(
  "--to-sheet-name <name>",
  "for spreadsheet data, the sheet name to read",
)

export const toTable = new Option(
  "--to-table <name>",
  "for database sources, the table name to read",
)

export const toDialectOptions = [
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
  toSheetName,
  toTable,
]

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
