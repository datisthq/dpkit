import os from "node:os"
import type { Field, Schema } from "@dpkit/core"
import { anyHorizontal, col } from "nodejs-polars"
import pAll from "p-all"
import type { TableError } from "../error/index.ts"
import { matchField } from "../field/index.ts"
import { validateField } from "../field/index.ts"
import { validateRows } from "../row/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { PolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"
import { normalizeFields } from "./normalize.ts"

export async function validateTable(
  table: Table,
  options?: {
    schema?: Schema
    sampleRows?: number
    maxErorrs?: number
  },
) {
  const { schema, sampleRows = 100, maxErorrs = 100 } = options ?? {}
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
      maxErorrs,
    )
    errors.push(...fieldErrors)
  }

  return {
    errors: errors.slice(0, maxErorrs),
    valid: !errors.length,
  }
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

  const requiredNames = fields
    .filter(field => field.constraints?.required)
    .map(field => field.name)

  const extraFields = polarsFields.length - fields.length
  const missingFields = fields.length - polarsFields.length

  const extraNames = arrayDiff(polarsNames, names)
  const missingNames = arrayDiff(names, polarsNames)
  const missingRequiredNames = arrayDiff(requiredNames, polarsNames)

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

    if (missingRequiredNames.length > 0) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingRequiredNames,
      })
    }
  }

  if (fieldsMatch === "subset") {
    if (missingRequiredNames.length > 0) {
      errors.push({
        type: "fields/missing",
        fieldNames: missingRequiredNames,
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
  maxErorrs: number,
) {
  const errors: TableError[] = []
  const concurrency = os.cpus().length
  const abortController = new AbortController()

  const collectFieldErrors = async (index: number, field: Field) => {
    const polarsField = matchField(index, field, schema, polarsSchema)
    if (!polarsField) return

    const report = await validateField(field, { table, polarsField })
    errors.push(...report.errors)

    if (errors.length > maxErorrs) {
      abortController.abort()
    }
  }

  try {
    await pAll(
      schema.fields.map((field, idx) => () => collectFieldErrors(idx, field)),
      { concurrency },
    )
  } catch (error) {
    const isAborted = error instanceof Error && error.name === "AbortError"
    if (!isAborted) throw error
  }

  return errors
}

function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}
