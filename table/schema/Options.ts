import type { GeopointField, ListField } from "@dpkit/core"
import type { Field } from "@dpkit/core"

export interface SchemaOptions {
  fieldNames?: string[]
  fieldTypes?: Record<string, Field["type"]>
  missingValues?: string[]
  decimalChar?: string
  groupChar?: string
  bareNumber?: boolean
  trueValues?: string[]
  falseValues?: string[]
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  listDelimiter?: string
  listItemType?: ListField["itemType"]
  geopointFormat?: GeopointField["format"]
}
