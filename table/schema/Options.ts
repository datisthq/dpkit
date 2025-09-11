import type { GeojsonField, GeopointField, ListField } from "@dpkit/core"
import type { StringField } from "@dpkit/core"
import type { Field } from "@dpkit/core"

type FieldType = Exclude<Field["type"], undefined>

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
  listDelimiter?: string
  listItemType?: ListField["itemType"]
  geopointFormat?: GeopointField["format"]
  geojsonFormat?: GeojsonField["format"]
}
