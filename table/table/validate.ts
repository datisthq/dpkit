import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { TableError } from "../error/index.js"
import { validateField } from "../field/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { PolarsSchema } from "../schema/index.js"
import type { Table } from "./Table.js"
import { processFields } from "./process.js"

export async function validateTable(
  table: Table,
  options: {
    schema: Schema | string
    sampleSize?: number
    invalidRowsLimit?: number
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
        type: "fields/extra",
        fieldNames: extraNames,
      })
    }

    if (missingFields > 0) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "equal") {
    if (extraNames.length > 0) {
      errors.push({
        type: "fields/extra",
        fieldNames: extraNames,
      })
    }

    if (missingNames.length > 0) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "subset") {
    if (missingNames.length > 0) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingNames,
      })
    }
  }

  if (fieldsMatch === "superset") {
    if (extraNames.length > 0) {
      errors.push({
        type: "fields/extra",
        fieldNames: extraNames,
      })
    }
  }

  if (fieldsMatch === "partial") {
    if (missingNames.length === fields.length) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingNames,
      })
    }
  }

  return errors
}

// TODO: remove
// @ts-ignore
async function validateChecks(
  table: Table,
  schema: Schema,
  polarsSchema: PolarsSchema,
  invalidRowsLimit: number,
) {
  const errors: TableError[] = []

  const sources = Object.entries(
    processFields(schema, polarsSchema, { dontParse: true }),
  ).map(([name, expr]) => {
    return expr.alias(`source:${name}`)
  })

  const targets = Object.entries(
    processFields(schema, polarsSchema, { dontParse: false }),
  ).map(([name, expr]) => {
    return expr.alias(`target:${name}`)
  })

  table = table.select([...sources, ...targets, lit(false).alias("error")])

  // Pass through checks

  const dfErrors = await table
    .filter(col("error").eq(true))
    .head(invalidRowsLimit)
    .collect()

  for (const record of dfErrors.toRecords() as any[]) {
    for (const [key, value] of Object.entries(record)) {
      const [kind, type, name] = key.split(":")
      if (kind === "error" && type && name && value === true) {
        errors.push({
          type: type as any,
          fieldName: name as any,
          rowNumber: record.number,
          cell: record.source ?? "",
        })
      }
    }
  }

  return errors
}

function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
