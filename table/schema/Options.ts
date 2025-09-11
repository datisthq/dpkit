import type { GeojsonField, GeopointField, ListField } from "@dpkit/core"
import type { StringField } from "@dpkit/core"
import type { FieldType } from "@dpkit/core"

export interface SchemaOptions {
  fieldNames?: string[]
  fieldTypes?: Record<string, FieldType>
  missingValues?: string[]
  stringFormat?: StringField["format"]
  decimalChar?: string
  groupChar?: string
  bareNumber?: boolean
  trueValues?: string[]
  falseValues?: string[]
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  arrayType?: "array" | "list"
  listDelimiter?: string
  listItemType?: ListField["itemType"]
  geopointFormat?: GeopointField["format"]
  geojsonFormat?: GeojsonField["format"]
}
