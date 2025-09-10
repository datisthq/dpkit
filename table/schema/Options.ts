import type { GeopointField, ListField } from "@dpkit/core"
import type { Field } from "@dpkit/core"

type FieldType = Exclude<Field["type"], undefined>

export interface SchemaOptions {
  fieldNames?: string[]
  fieldTypes?: Record<string, FieldType>
  convertTypes?: Record<FieldType, FieldType>
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
