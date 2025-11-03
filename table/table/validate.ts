import os from "node:os"
import type { Field, Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import pAll from "p-all"
import type { RowError } from "../error/index.ts"
import type { TableError } from "../error/index.ts"
import { validateField } from "../field/index.ts"
import { arrayDiff } from "../helpers.ts"
import { matchSchemaField } from "../schema/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { SchemaMapping } from "../schema/index.ts"
import type { Table } from "./Table.ts"
import { createChecksRowUnique } from "./checks/unique.ts"

export async function validateTable(
  table: Table,
  options?: {
    schema?: Schema
    sampleRows?: number
    maxErrors?: number
  },
) {
  const { schema, sampleRows = 100, maxErrors = 1000 } = options ?? {}
  const errors: TableError[] = []

  if (schema) {
    const sample = await table.head(sampleRows).collect()
    const polarsSchema = getPolarsSchema(sample.schema)
    const mapping = { source: polarsSchema, target: schema }

    const matchErrors = validateFieldsMatch(mapping)
    errors.push(...matchErrors)

    const fieldErrors = await validateFields(mapping, table, { maxErrors })
    errors.push(...fieldErrors)

    const rowErrors = await validateRows(mapping, table, { maxErrors })
    errors.push(...rowErrors)
  }

  return {
    errors: errors.slice(0, maxErrors),
    valid: !errors.length,
  }
}

function validateFieldsMatch(mapping: SchemaMapping) {
  const errors: TableError[] = []
  const fieldsMatch = mapping.target.fieldsMatch ?? "exact"

  const fields = mapping.target.fields
  const polarsFields = mapping.source.fields

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
  mapping: SchemaMapping,
  table: Table,
  options: {
    maxErrors: number
  },
) {
  const { maxErrors } = options
  const errors: TableError[] = []
  const fields = mapping.target.fields
  const concurrency = os.cpus().length
  const abortController = new AbortController()
  const maxFieldErrors = Math.ceil(maxErrors / fields.length)

  const collectFieldErrors = async (index: number, field: Field) => {
    const fieldMapping = matchSchemaField(mapping, field, index)
    if (!fieldMapping) return

    const report = await validateField(fieldMapping, table, {
      maxErrors: maxFieldErrors,
    })

    errors.push(...report.errors)
    if (errors.length > maxErrors) {
      abortController.abort()
    }
  }

  try {
    await pAll(
      fields.map((field, index) => () => collectFieldErrors(index, field)),
      { concurrency },
    )
  } catch (error) {
    const isAborted = error instanceof Error && error.name === "AbortError"
    if (!isAborted) throw error
  }

  return errors
}

async function validateRows(
  mapping: SchemaMapping,
  table: Table,
  options: { maxErrors: number },
) {
  const { maxErrors } = options
  const errors: TableError[] = []
  const fields = mapping.target.fields
  const concurrency = os.cpus().length - 1
  const abortController = new AbortController()
  const maxRowErrors = Math.ceil(maxErrors / fields.length)

  const collectRowErrors = async (check: any) => {
    const rowCheckTable = table
      .withRowCount()
      .withColumn(pl.col("row_nr").add(1))
      .rename({ row_nr: "dpkit:number" })
      .withColumn(
        pl
          .when(check.isErrorExpr)
          .then(pl.lit(JSON.stringify(check.errorTemplate)))
          .otherwise(pl.lit(null))
          .alias("dpkit:error"),
      )

    const rowCheckFrame = await rowCheckTable
      .filter(pl.col("dpkit:error").isNotNull())
      .head(maxRowErrors)
      .collect()

    for (const row of rowCheckFrame.toRecords() as any[]) {
      const errorTemplate = JSON.parse(row["dpkit:error"]) as RowError
      errors.push({
        ...errorTemplate,
        rowNumber: row["dpkit:number"],
      })
    }

    if (errors.length > maxErrors) {
      abortController.abort()
    }
  }

  try {
    await pAll(
      [...createChecksRowUnique(mapping)].map(it => () => collectRowErrors(it)),
      { concurrency },
    )
  } catch (error) {
    const isAborted = error instanceof Error && error.name === "AbortError"
    if (!isAborted) throw error
  }

  return errors
}
