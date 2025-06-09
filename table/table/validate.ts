import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { TableError } from "../error/index.js"
import { matchField } from "../field/index.js"
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
  const { sampleSize = 100, invalidRowsLimit = 100 } = options
  const errors: TableError[] = []

  const schema =
    typeof options.schema === "string"
      ? await loadSchema(options.schema)
      : options.schema

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  const matchErrors = validateFieldsMatch({ schema, polarsSchema })
  errors.push(...matchErrors)

  const fieldErrors = await validateFields(
    table,
    schema,
    polarsSchema,
    invalidRowsLimit,
  )
  errors.push(...fieldErrors)

  const valid = errors.length === 0
  return { valid, errors }
}

function validateFieldsMatch(props: {
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

async function validateFields(
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

  let errorTable = table
    .withRowCount()
    .select([
      col("row_nr").add(1).alias("number"),
      lit(false).alias("error"),
      ...sources,
      ...targets,
    ])

  // Row-level checks
  // TODO: implement row-level checks

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    if (!polarsField) {
      continue
    }

    const result = validateField(field, { errorTable, polarsField })
    errorTable = result.errorTable
    errors.push(...result.errors)
  }

  const errorFrame = await errorTable
    .filter(col("error").eq(true))
    // TODO: drop target columns here to reduce memory usage
    .head(invalidRowsLimit)
    .collect()

  for (const record of errorFrame.toRecords() as any[]) {
    for (const [key, value] of Object.entries(record)) {
      const [kind, type, name] = key.split(":")
      if (kind !== "error" || value !== true) {
        continue
      }

      // Row-level errors
      // TODO: implement row-level errors

      // Cell-level errors
      if (type && name) {
        errors.push({
          type: type as any,
          fieldName: name as any,
          rowNumber: record.number,
          cell: record[`source:${name}`] ?? "",
        })
      }
    }
  }

  return errors
}

function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
