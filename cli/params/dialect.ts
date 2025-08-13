import { Option } from "commander"
import type { Dialect } from "dpkit"

export const header = new Option(
  "--header",
  "whether the file includes a header row with field names",
).default(true)

export const headerRows = new Option(
  "--header-rows <rows>",
  "comma-separated row numbers (zero-based) that are considered header rows",
)

export const headerJoin = new Option(
  "--header-join <char>",
  "character used to join multi-line headers",
)

export const commentRows = new Option(
  "--comment-rows <rows>",
  "comma-separated rows to be excluded from the data (zero-based)",
)

export const commentChar = new Option(
  "--comment-char <char>",
  "character sequence denoting the start of a comment line",
)

export const delimiter = new Option(
  "-d, --delimiter <char>",
  "character used to separate fields in the data",
)

export const lineTerminator = new Option(
  "--line-terminator <char>",
  "character sequence used to terminate rows",
)

export const quoteChar = new Option(
  "--quote-char <char>",
  "character used to quote fields",
)

export const doubleQuote = new Option(
  "--double-quote",
  "whether a sequence of two quote characters represents a single quote",
)

export const escapeChar = new Option(
  "--escape-char <char>",
  "character used to escape the delimiter or quote characters",
)

export const nullSequence = new Option(
  "--null-sequence <seq>",
  "character sequence representing null or missing values in the data",
)

export const skipInitialSpace = new Option(
  "--skip-initial-space",
  "whether to ignore whitespace immediately following the delimiter",
)

export const property = new Option(
  "--property <name>",
  "for JSON data, the property name containing the data array",
)

export const itemType = new Option(
  "--item-type <type>",
  "the type of data item in the source",
).choices(["array", "object"])

export const itemKeys = new Option(
  "--item-keys <keys>",
  "comma-separated object properties to extract as values (for object-based data items)",
)

export const sheetNumber = new Option(
  "--sheet-number <num>",
  "for spreadsheet data, the sheet number to read (zero-based)",
).argParser(Number.parseInt)

export const sheetName = new Option(
  "--sheet-name <name>",
  "for spreadsheet data, the sheet name to read",
)

export const table = new Option(
  "--table <name>",
  "for database sources, the table name to read",
)

export const dialectOptions = [
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
  sheetName,
  table,
]

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
