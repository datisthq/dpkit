import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { validateColumn } from "../column/index.js"
import type { TableError } from "../error/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { PolarsSchema } from "../schema/index.js"
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

  const structureErrors = validateStructure({ schema, polarsSchema })
  errors.push(...structureErrors)

  const columnErrorGroups = await Promise.all(
    schema.fields.map(field => validateColumn({ field })),
  )

  for (const columnErrors of columnErrorGroups) {
    errors.push(...columnErrors)
  }

  const valid = errors.length === 0
  return { valid, errors }
}

function validateStructure(props: {
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
        type: "structure",
        category: "extra",
        fieldNames: extraNames,
      })
    }

    if (missingFields > 0) {
      errors.push({
        fieldsMatch,
        type: "structure",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "equal") {
    if (extraNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "structure",
        category: "extra",
        fieldNames: extraNames,
      })
    }

    if (missingNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "structure",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "subset") {
    if (missingNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "structure",
        category: "missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "superset") {
    if (extraNames.length > 0) {
      errors.push({
        fieldsMatch,
        type: "structure",
        category: "extra",
        fieldNames: extraNames,
      })
    }
  }

  if (fieldsMatch === "partial") {
    if (missingNames.length === fields.length) {
      errors.push({
        fieldsMatch,
        type: "structure",
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
