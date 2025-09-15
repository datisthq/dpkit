import { Option } from "commander"

export const fieldNames = new Option(
  "--field-names <fieldNames>",
  "a list of comma-separated field names to use for the schema",
).argParser((value: string) => value.split(","))

export const fieldTypes = new Option(
  "--field-types <fieldTypes>",
  "a list of comma-separated field name:type pairs to use for the schema",
).argParser((value: string) => {
  const result: Record<string, string> = {}
  value.split(",").forEach(pair => {
    const [key, val] = pair.split(":")
    if (key && val) result[key] = val
  })
  return result
})

export const missingValues = new Option(
  "--missing-values <missingValues>",
  "comma-separated values to treat as missing",
).argParser((value: string) => value.split(","))

export const stringFormat = new Option(
  "--string-format <stringFormat>",
  "string field format (default, email, uri, binary, uuid)",
)

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
)

export const geopointFormat = new Option(
  "--geopoint-format <geopointFormat>",
  "geopoint format (default, array, object)",
).choices(["default", "array", "object"])

export const geojsonFormat = new Option(
  "--geojson-format <geojsonFormat>",
  "geojson format (default, topojson)",
).choices(["default", "topojson"])
