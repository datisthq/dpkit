import type { Field, Schema } from "@dpkit/core"
import type { CkanField, CkanFieldInfo } from "../Field.js"
import type { CkanSchema } from "../Schema.js"

/**
 * Denormalizes a Table Schema to a CKAN schema format
 * @param props Object containing the Table Schema to denormalize
 * @returns A denormalized CKAN Schema object
 */
export function denormalizeCkanSchema(props: { schema: Schema }): CkanSchema {
  const { schema } = props

  const fields = schema.fields.map(denormalizeCkanField)

  return { fields }
}

function denormalizeCkanField(field: Field): CkanField {
  const { name, title, description, type } = field

  const ckanField: CkanField = {
    id: name,
    type: mapTypeToCkan(type),
  }

  if (title || description) {
    const fieldInfo: CkanFieldInfo = {} as CkanFieldInfo

    if (title) fieldInfo.label = title
    if (description) fieldInfo.notes = description

    // Add type override if necessary
    fieldInfo.type_override = mapTypeToCkan(type)

    ckanField.info = fieldInfo
  }

  return ckanField
}

/**
 * Maps Table Schema types to CKAN field types
 */
function mapTypeToCkan(type?: string): string {
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
