import type { Schema } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { TableError } from "../error/index.ts"
import { matchField } from "../field/index.ts"
import { validateField } from "../field/index.ts"
import { validateRows } from "../row/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { PolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"
import { processFields } from "./process.ts"

export async function validateTable(
  table: Table,
  options?: {
    schema?: Schema
    sampleRows?: number
    invalidRowsLimit?: number
  },
) {
  const { schema, sampleRows = 100, invalidRowsLimit = 100 } = options ?? {}
  const errors: TableError[] = []

  if (schema) {
    const sample = await table.head(sampleRows).collect()
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
  }

  return errors
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
  const targetNames: string[] = []

  const sources = Object.entries(
    processFields(schema, polarsSchema, { noParse: true }),
  ).map(([name, expr]) => {
    return expr.alias(`source:${name}`)
  })

  const targets = Object.entries(
    processFields(schema, polarsSchema, { noParse: false }),
  ).map(([name, expr]) => {
    const targetName = `target:${name}`
    targetNames.push(targetName)
    return expr.alias(targetName)
  })

  let errorTable = table
    .withRowCount()
    .select([
      col("row_nr").add(1),
      lit(false).alias("error"),
      ...sources,
      ...targets,
    ])

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    if (polarsField) {
      const fieldResult = validateField(field, { errorTable, polarsField })
      errorTable = fieldResult.errorTable
      errors.push(...fieldResult.errors)
    }
  }

  const rowsResult = validateRows(schema, errorTable)
  errorTable = rowsResult.errorTable
  errors.push(...rowsResult.errors)

  const errorFrame = await errorTable
    .filter(col("error").eq(true))
    .head(invalidRowsLimit)
    .drop(targetNames)
    .collect()

  for (const record of errorFrame.toRecords() as any[]) {
    for (const [key, value] of Object.entries(record)) {
      const [kind, type, name] = key.split(":")

      if (kind === "error" && value === true && type && name) {
        const rowNumber = record.row_nr

        // Cell-level errors
        if (type.startsWith("cell/")) {
          errors.push({
            rowNumber,
            type: type as any,
            fieldName: name as any,
            cell: (record[`source:${name}`] ?? "").toString(),
          })
        }

        // Row-level errors
        if (type.startsWith("row/")) {
          errors.push({
            rowNumber,
            type: type as any,
            fieldNames: name.split(","),
          })
        }
      }
    }
  }

  return errors
}

function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
