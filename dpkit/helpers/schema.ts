import type { SchemaOptions } from "@dpkit/all"

// TODO: Find a better way to construct schema options

export function createSchemaOptionsFromToSchemaOptions(
  options: any,
): SchemaOptions {
  const result: SchemaOptions = {}

  if (options.toFieldNames !== undefined)
    result.fieldNames = options.toFieldNames
  if (options.toFieldTypes !== undefined)
    result.fieldTypes = options.toFieldTypes
  if (options.toMissingValues !== undefined)
    result.missingValues = options.toMissingValues
  if (options.toStringFormat !== undefined)
    result.stringFormat = options.toStringFormat
  if (options.toDecimalChar !== undefined)
    result.decimalChar = options.toDecimalChar
  if (options.toGroupChar !== undefined) result.groupChar = options.toGroupChar
  if (options.toBareNumber !== undefined)
    result.bareNumber = options.toBareNumber
  if (options.toTrueValues !== undefined)
    result.trueValues = options.toTrueValues
  if (options.toFalseValues !== undefined)
    result.falseValues = options.toFalseValues
  if (options.toDatetimeFormat !== undefined)
    result.datetimeFormat = options.toDatetimeFormat
  if (options.toDateFormat !== undefined)
    result.dateFormat = options.toDateFormat
  if (options.toTimeFormat !== undefined)
    result.timeFormat = options.toTimeFormat
  if (options.toArrayType !== undefined) result.arrayType = options.toArrayType
  if (options.toListDelimiter !== undefined)
    result.listDelimiter = options.toListDelimiter
  if (options.toListItemType !== undefined)
    result.listItemType = options.toListItemType
  if (options.toGeopointFormat !== undefined)
    result.geopointFormat = options.toGeopointFormat
  if (options.toGeojsonFormat !== undefined)
    result.geojsonFormat = options.toGeojsonFormat

  return result
}
