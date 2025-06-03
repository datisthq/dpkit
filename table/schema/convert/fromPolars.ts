import type { Schema } from "@dpkit/core"
import { convertFieldFromPolars } from "../../field/index.js"
import type { PolarsSchema } from "../Schema.js"

export function convertSchemaFromPolars(props: {
  polarsSchema: PolarsSchema
}): Schema {
  const { polarsSchema } = props

  const fields = Object.entries(polarsSchema).map(([name, type]) => {
    return convertFieldFromPolars({ polarsField: { name, type } })
  })

  return { fields }
}
