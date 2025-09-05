import type { GeopointField, ListField } from "@dpkit/core"

interface FieldOptions {
  decimalChar?: string
  groupChar?: string
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  listDelimiter?: string
  listItemType?: ListField["itemType"]
  geopointFormat?: GeopointField["format"]
}

export interface ParseFieldOptions extends FieldOptions {
  missingValues?: string[]
  bareNumber?: boolean
  trueValues?: string[]
  falseValues?: string[]
}

export interface StringifyFieldOptions extends FieldOptions {
  missingValue?: string
  trueValue?: string
  falseValue?: string
}
