import { Option } from "commander"

export const dialect = new Option(
  "--dialect <dialect>",
  "path to a table dialect descriptor",
)

export const sampleBytes = new Option(
  "--sample-bytes <bytes>",
  "number of bytes to sample from the file",
).argParser(Number.parseInt)

export const header = new Option(
  "--header <header>",
  "whether the file includes a header row with field names",
)
  .choices(["true", "false"])
  .argParser((value: string) => value === "true")

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
  "--delimiter <char>",
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

export const toDialect = new Option(
  "--to-dialect <toDialect>",
  "path to a table dialect descriptor",
)

export const toHeader = new Option(
  "--to-header",
  "whether the file includes a header row with field names",
)
  .choices(["true", "false"])
  .argParser((value: string) => value === "true")

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
