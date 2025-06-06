import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { getPolarsSchema } from "../schema/index.js"
import type { PolarsSchema } from "../schema/index.js"
//import { validateColumn } from "../column/index.js"
import type { StructureError, TableError } from "./Error.js"
import type { Table } from "./Table.js"

export async function validateTable(props: {
  table: Table
  schema: Schema | string
  sampleSize?: number
}) {
  const { table, sampleSize = 100 } = props
  const errors: TableError[] = []

  const schema =
    typeof props.schema === "string"
      ? await loadSchema({ path: props.schema })
      : props.schema

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema({ typeMapping: sample.schema })

  validateStructure({ schema, polarsSchema })

  return errors
}

function validateStructure(props: {
  schema: Schema
  polarsSchema: PolarsSchema
}) {
  const { schema, polarsSchema } = props
  const errors: StructureError[] = []

  const fields = schema.fields
  const polarsFields = polarsSchema.fields
  const fieldsMatch = schema.fieldsMatch ?? "exact"

  if (fieldsMatch === "exact") {
    const extraFields = polarsFields.length - fields.length
    const missingFields = fields.length - polarsFields.length

    if (extraFields > 0) {
      errors.push({
        type: "structure",
        message: `Extra fields: ${extraFields}`,
      })
    }

    if (missingFields > 0) {
      errors.push({
        type: "structure",
        message: `Missing fields: ${missingFields}`,
      })
    }
  }

  if (fieldsMatch === "equal") {
    const names = fields.map(field => field.name)
    const polarsNames = polarsFields.map(field => field.name)

    const extraNames = arrayDiff(polarsNames, names)
    const missingNames = arrayDiff(names, polarsNames)

    if (extraNames.length > 0) {
      errors.push({
        type: "structure",
        message: `Extra fields: ${extraNames.join(", ")}`,
      })
    }

    if (missingNames.length > 0) {
      errors.push({
        type: "structure",
        message: `Missing fields: ${missingNames.join(", ")}`,
      })
    }
  }

  return errors
}

function arrayDiff(a, b) {
  return a.filter(x => !b.includes(x))
}
