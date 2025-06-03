import type { Schema } from "@dpkit/core"
import { convertFieldToPolars } from "../../field/index.js"
import type { PolarsSchema } from "../Schema.js"

export function convertSchemaToPolars(props: { schema: Schema }): PolarsSchema {
  const { schema } = props

  const polarsFields = schema.fields.map(field =>
    convertFieldToPolars({ field }),
  )

  const polarsSchema = Object.fromEntries(
    polarsFields.map(field => [field.name, field.type]),
  )

  return polarsSchema
}
