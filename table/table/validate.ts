import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import type { TableError } from "../error/index.js"
import { validateField } from "../field/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { PolarsSchema } from "../schema/index.js"
import type { Table } from "./Table.js"

export async function validateTable(
  table: Table,
  options: {
    schema: Schema | string
    sampleSize?: number
  },
) {
  const { sampleSize = 100 } = options
  const errors: TableError[] = []

  const schema =
    typeof options.schema === "string"
      ? await loadSchema(options.schema)
      : options.schema

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  const structureErrors = validateFields({ schema, polarsSchema })
  errors.push(...structureErrors)

  const polarsFields = polarsSchema.fields
  const fieldsMatch = schema.fieldsMatch ?? "exact"

  const fieldErrorGroups = await Promise.all(
    schema.fields.map((field, index) => {
      const polarsField =
        fieldsMatch !== "exact"
          ? polarsFields.find(polarsField => polarsField.name === field.name)
          : polarsFields[index]

      return polarsField ? validateField(field, { table, polarsField }) : []
    }),
  )

  for (const fieldErrors of fieldErrorGroups) {
    errors.push(...fieldErrors)
  }

  const valid = errors.length === 0
  return { valid, errors }
}

function validateFields(props: {
  schema: Schema
  polarsSchema: PolarsSchema
}) {
  const { schema, polarsSchema } = props

  const errors: TableError[] = []
  const fieldsMatch = schema.fieldsMatch ?? "exact"

  const fields = schema.fields
  const polarsFields = polarsSchema.fields

  const names = fields.map(field => field.name)
  const polarsNames = polarsFields.map(field => field.name)

  const extraFields = polarsFields.length - fields.length
  const missingFields = fields.length - polarsFields.length

  const extraNames = arrayDiff(polarsNames, names)
  const missingNames = arrayDiff(names, polarsNames)

  if (fieldsMatch === "exact") {
    if (extraFields > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "extra",
        fieldNames: extraNames,
      })
    }

    if (missingFields > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "equal") {
    if (extraNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "extra",
        fieldNames: extraNames,
      })
    }

    if (missingNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "subset") {
    if (missingNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "superset") {
    if (extraNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "extra",
        fieldNames: extraNames,
      })
    }
  }

  if (fieldsMatch === "partial") {
    if (missingNames.length === fields.length) {
      errors.push({
        fieldsMatch,
        type: "fields",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  return errors
}

function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
