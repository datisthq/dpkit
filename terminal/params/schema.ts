import type { FieldType } from "@dpkit/library"
import { Option } from "commander"

export const schema = new Option(
  "--schema <schema>",
  "path to a table schema descriptor",
)

export const sampleRows = new Option(
  "--sample-rows <sampleRows>",
  "number of rows to sample for schema inference",
).argParser(Number.parseInt)

export const confidence = new Option(
  "--confidence <confidence>",
  "confidence threshold for schema inference",
).argParser(Number.parseFloat)

export const commaDecimal = new Option(
  "--comma-decimal",
  "use comma as decimal separator in schema inference",
)

export const monthFirst = new Option(
  "--month-first",
  "interpret dates as month-first in schema inference",
)

export const keepStrings = new Option(
  "--keep-strings",
  "keep fields as strings instead of inferring types",
)

export const fieldNames = new Option(
  "--field-names <fieldNames>",
  "a list of comma-separated field names to use for the schema",
).argParser((value: string) => value.split(","))

export const fieldTypes = new Option(
  "--field-types <fieldTypes>",
  "a list of comma-separated field name:type pairs to use for the schema",
).argParser((value: string) => {
  const result: Record<string, FieldType> = {}
  value.split(",").forEach(pair => {
    const [key, val] = pair.split(":")
    // TODO: Properly validate instead of casting
    if (key && val) result[key] = val as FieldType
  })
  return result
})

export const missingValues = new Option(
  "--missing-values <missingValues>",
  "comma-separated values to treat as missing",
).argParser((value: string) => value.split(","))

export const stringFormat = new Option(
  "--string-format <stringFormat>",
  "string field format (email, uri, binary, uuid)",
).choices(["email", "uri", "binary", "uuid"])

export const decimalChar = new Option(
  "--decimal-char <decimalChar>",
  "character to use as decimal separator",
)

export const groupChar = new Option(
  "--group-char <groupChar>",
  "character to use for digit grouping",
)

export const bareNumber = new Option(
  "--bare-number <bareNumber>",
  "allow bare numbers without quotes",
)
  .choices(["true", "false"])
  .argParser((value: string) => value === "true")

export const trueValues = new Option(
  "--true-values <trueValues>",
  "values to treat as true",
).argParser((value: string) => value.split(","))

export const falseValues = new Option(
  "--false-values <falseValues>",
  "values to treat as false",
).argParser((value: string) => value.split(","))

export const datetimeFormat = new Option(
  "--datetime-format <datetimeFormat>",
  "datetime format pattern",
)

export const dateFormat = new Option(
  "--date-format <dateFormat>",
  "date format pattern",
)

export const timeFormat = new Option(
  "--time-format <timeFormat>",
  "time format pattern",
)

export const arrayType = new Option(
  "--array-type <arrayType>",
  "array type (array or list)",
).choices(["array", "list"])

export const listDelimiter = new Option(
  "--list-delimiter <listDelimiter>",
  "delimiter for list values",
)

export const listItemType = new Option(
  "--list-item-type <listItemType>",
  "type of items in lists",
).choices([
  "string",
  "integer",
  "number",
  "boolean",
  "datetime",
  "date",
  "time",
])

export const geopointFormat = new Option(
  "--geopoint-format <geopointFormat>",
  "geopoint format (default, array, object)",
).choices(["default", "array", "object"])

export const geojsonFormat = new Option(
  "--geojson-format <geojsonFormat>",
  "geojson format (default, topojson)",
).choices(["default", "topojson"])

export const toSchema = new Option(
  "--to-schema <toSchema>",
  "path to a table schema descriptor",
)

export const toFieldNames = new Option(
  "--to-field-names <fieldNames>",
  "a list of comma-separated field names to use for the schema",
).argParser((value: string) => value.split(","))

export const toFieldTypes = new Option(
  "--to-field-types <fieldTypes>",
  "a list of comma-separated field name:type pairs to use for the schema",
).argParser((value: string) => {
  const result: Record<string, FieldType> = {}
  value.split(",").forEach(pair => {
    const [key, val] = pair.split(":")
    // TODO: Properly validate instead of casting
    if (key && val) result[key] = val as FieldType
  })
  return result
})

export const toMissingValues = new Option(
  "--to-missing-values <missingValues>",
  "comma-separated values to treat as missing",
).argParser((value: string) => value.split(","))

export const toStringFormat = new Option(
  "--to-string-format <stringFormat>",
  "string field format (default, email, uri, binary, uuid)",
).choices(["email", "uri", "binary", "uuid"])

export const toDecimalChar = new Option(
  "--to-decimal-char <decimalChar>",
  "character to use as decimal separator",
)

export const toGroupChar = new Option(
  "--to-group-char <groupChar>",
  "character to use for digit grouping",
)

export const toBareNumber = new Option(
  "--to-bare-number <bareNumber>",
  "allow bare numbers without quotes",
)
  .choices(["true", "false"])
  .argParser((value: string) => value === "true")

export const toTrueValues = new Option(
  "--to-true-values <trueValues>",
  "values to treat as true",
).argParser((value: string) => value.split(","))

export const toFalseValues = new Option(
  "--to-false-values <falseValues>",
  "values to treat as false",
).argParser((value: string) => value.split(","))

export const toDatetimeFormat = new Option(
  "--to-datetime-format <datetimeFormat>",
  "datetime format pattern",
)

export const toDateFormat = new Option(
  "--to-date-format <dateFormat>",
  "date format pattern",
)

export const toTimeFormat = new Option(
  "--to-time-format <timeFormat>",
  "time format pattern",
)

export const toArrayType = new Option(
  "--to-array-type <arrayType>",
  "array type (array or list)",
).choices(["array", "list"])

export const toListDelimiter = new Option(
  "--to-list-delimiter <listDelimiter>",
  "delimiter for list values",
)

export const toListItemType = new Option(
  "--to-list-item-type <listItemType>",
  "type of items in lists",
).choices([
  "string",
  "integer",
  "number",
  "boolean",
  "datetime",
  "date",
  "time",
])

export const toGeopointFormat = new Option(
  "--to-geopoint-format <geopointFormat>",
  "geopoint format (default, array, object)",
).choices(["default", "array", "object"])

export const toGeojsonFormat = new Option(
  "--to-geojson-format <geojsonFormat>",
  "geojson format (default, topojson)",
).choices(["default", "topojson"])
