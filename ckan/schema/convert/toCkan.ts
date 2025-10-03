import type { Field, Schema } from "@dpkit/core"
import type { CkanField, CkanFieldInfo } from "../Field.ts"
import type { CkanSchema } from "../Schema.ts"

export function convertSchemaToCkan(schema: Schema): CkanSchema {
  const fields = schema.fields.map(convertField)

  return { fields }
}

function convertField(field: Field): CkanField {
  const { name, title, description, type } = field

  const ckanField: CkanField = {
    id: name,
    type: convertType(type),
  }

  if (title || description) {
    const fieldInfo: CkanFieldInfo = {} as CkanFieldInfo

    if (title) fieldInfo.label = title
    if (description) fieldInfo.notes = description

    fieldInfo.type_override = convertType(type)

    ckanField.info = fieldInfo
  }

  return ckanField
}

function convertType(type?: string): string {
  switch (type) {
    case "string":
      return "text"
    case "integer":
      return "int"
    case "number":
      return "numeric"
    case "boolean":
      return "bool"
    case "date":
      return "date"
    case "time":
      return "time"
    case "datetime":
      return "timestamp"
    case "object":
      return "json"
    case "array":
      return "array"
    case "geopoint":
      return "geopoint"
    case "geojson":
      return "geojson"
    default:
      return "text"
  }
}
