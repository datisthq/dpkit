import type { Field, Schema } from "@dpkit/core"
import type {
  ArrayField,
  BooleanField,
  DateField,
  DatetimeField,
  IntegerField,
  NumberField,
  ObjectField,
  StringField,
  TimeField,
} from "@dpkit/core"
import type { CkanField } from "../Field.js"
import type { CkanSchema } from "../Schema.js"

/**
 * Normalizes a CKAN schema to a Table Schema format
 * @param props Object containing the CKAN schema to normalize
 * @returns A normalized Table Schema object
 */
export function normalizeCkanSchema(props: { ckanSchema: CkanSchema }): Schema {
  const { ckanSchema } = props

  const fields = ckanSchema.fields.map(normalizeCkanField)

  return { fields }
}

function normalizeCkanField(ckanField: CkanField) {
  const { id, type, info } = ckanField

  const field: Partial<Field> = {
    name: id,
  }

  // Add metadata from info if available
  if (info) {
    if (info.label) field.title = info.label
    if (info.notes) field.description = info.notes
  }

  const fieldType = (info?.type_override || type).toLowerCase()
  switch (fieldType) {
    case "text":
    case "string":
      return { ...field, type: "string" } as StringField
    case "int":
    case "integer":
      return { ...field, type: "integer" } as IntegerField
    case "numeric":
    case "number":
    case "float":
      return { ...field, type: "number" } as NumberField
    case "bool":
    case "boolean":
      return { ...field, type: "boolean" } as BooleanField
    case "date":
      return { ...field, type: "date" } as DateField
    case "time":
      return { ...field, type: "time" } as TimeField
    case "timestamp":
    case "datetime":
      return { ...field, type: "datetime" } as DatetimeField
    case "json":
    case "object":
      return { ...field, type: "object" } as ObjectField
    case "array":
      return { ...field, type: "array" } as ArrayField
    default:
      return { ...field, type: "any" } as Field
  }
}
