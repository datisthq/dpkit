import type { Field } from "@dpkit/core"
import type { SchemaMapping } from "./Mapping.ts"

export function matchSchemaField(
  mapping: SchemaMapping,
  field: Field,
  index: number,
) {
  const fieldsMatch = mapping.target.fieldsMatch ?? "exact"

  const polarsField =
    fieldsMatch !== "exact"
      ? mapping.source.fields.find(it => it.name === field.name)
      : mapping.source.fields[index]

  return polarsField ? { source: polarsField, target: field } : undefined
}
