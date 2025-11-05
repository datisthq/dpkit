import type { Field, Schema } from "@dpkit/metadata"
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
} from "@dpkit/metadata"
import type { CkanField } from "../Field.ts"
import type { CkanSchema } from "../Schema.ts"

export function convertSchemaFromCkan(ckanSchema: CkanSchema): Schema {
  const fields = ckanSchema.fields.map(convertField)

  return { fields }
}

function convertField(ckanField: CkanField) {
  const { id, type, info } = ckanField

  const field: Partial<Field> = {
    name: id,
  }

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
