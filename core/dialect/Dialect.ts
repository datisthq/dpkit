import type { Metadata } from "../general/index.ts"

/**
 * Descriptor that describes the structure of tabular data, such as delimiters,
 * headers, and other features. Following the Data Package standard:
 * https://datapackage.org/standard/table-dialect/
 */
export interface Dialect extends Metadata {
  /**
   * JSON schema profile URL for validation
   */
  $schema?: string

  /**
   * The name of this dialect
   */
  name?: string

  /**
   * Whether the file includes a header row with field names
   */
  header?: boolean

  /**
   * Row numbers (zero-based) that are considered header rows
   */
  headerRows?: number[]

  /**
   * The character used to join multi-line headers
   */
  headerJoin?: string

  /**
   * Specific rows to be excluded from the data (zero-based)
   */
  commentRows?: number[]

  /**
   * Character sequence denoting the start of a comment line
   */
  commentChar?: string

  /**
   * The character used to separate fields in the data
   */
  delimiter?: string

  /**
   * Character sequence used to terminate rows
   */
  lineTerminator?: string

  /**
   * Character used to quote fields
   */
  quoteChar?: string

  /**
   * Controls whether a sequence of two quote characters represents a single quote
   */
  doubleQuote?: boolean

  /**
   * Character used to escape the delimiter or quote characters
   */
  escapeChar?: string

  /**
   * Character sequence representing null or missing values in the data
   */
  nullSequence?: string

  /**
   * Whether to ignore whitespace immediately following the delimiter
   */
  skipInitialSpace?: boolean

  /**
   * For JSON data, the property name containing the data array
   */
  property?: string

  /**
   * The type of data item in the source: 'array' for rows represented as arrays,
   * or 'object' for rows represented as objects
   */
  itemType?: "array" | "object"

  /**
   * For object-based data items, specifies which object properties to extract as values
   */
  itemKeys?: string[]

  /**
   * For spreadsheet data, the sheet number to read (zero-based)
   */
  sheetNumber?: number

  /**
   * For spreadsheet data, the sheet name to read
   */
  sheetName?: string

  /**
   * For database sources, the table name to read
   */
  table?: string
}
