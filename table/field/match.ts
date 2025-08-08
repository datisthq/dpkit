import type { Field, Schema } from "@dpkit/core"
import type { PolarsSchema } from "../schema/index.ts"

export function matchField(
  index: number,
  field: Field,
  schema: Schema,
  polarsSchema: PolarsSchema,
) {
  const fieldsMatch = schema.fieldsMatch ?? "exact"
  return fieldsMatch !== "exact"
    ? polarsSchema.fields.find(polarsField => polarsField.name === field.name)
    : polarsSchema.fields[index]
}
