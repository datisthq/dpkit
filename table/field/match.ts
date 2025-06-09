import type { Field, Schema } from "@dpkit/core"
import type { PolarsSchema } from "../schema/index.js"

export function matchField(
  index: number,
  field: Field,
  schema: Schema,
  polarsSchema: PolarsSchema,
) {
  return schema.fieldsMatch !== "exact"
    ? polarsSchema.fields.find(polarsField => polarsField.name === field.name)
    : polarsSchema.fields[index]
}
