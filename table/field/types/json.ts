import type { ArrayField, GeojsonField, ObjectField } from "@dpkit/core"
import { inspectJsonValue } from "@dpkit/core"
import type { CellError } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { isObject } from "../../helpers.ts"
import type { Table } from "../../table/index.ts"

// TODO: Improve the implementation
// Make unblocking / handle large data / process in parallel / move processing to Rust?

export async function inspectJsonField(
  field: ArrayField | GeojsonField | ObjectField,
  table: Table,
  options?: {
    formatJsonSchema?: Record<string, any>
  },
) {
  const errors: CellError[] = []

  const formatJsonSchema = options?.formatJsonSchema
  const constraintJsonSchema = field.constraints?.jsonSchema

  const frame = await table
    .withRowCount()
    .select(
      pl.pl.col("row_nr").add(1).alias("number"),
      pl.pl.col(field.name).alias("source"),
    )
    .collect()

  for (const row of frame.toRecords() as any[]) {
    if (row.source === null) continue

    let target: Record<string, any> | undefined
    const checkCompat = field.type === "array" ? Array.isArray : isObject

    try {
      target = JSON.parse(row.source)
    } catch (error) {}

    if (!target || !checkCompat(target)) {
      errors.push({
        type: "cell/type",
        cell: String(row.source),
        fieldName: field.name,
        fieldType: field.type,
        fieldFormat: field.format,
        rowNumber: row.number,
      })

      continue
    }

    if (formatJsonSchema) {
      const formatErrors = await inspectJsonValue(target, {
        jsonSchema: formatJsonSchema,
      })

      if (formatErrors.length) {
        errors.push({
          type: "cell/type",
          cell: String(row.source),
          fieldName: field.name,
          fieldType: field.type,
          fieldFormat: field.format,
          rowNumber: row.number,
        })
      }

      continue
    }

    if (constraintJsonSchema) {
      const constraintErrors = await inspectJsonValue(target, {
        jsonSchema: constraintJsonSchema,
      })

      for (const error of constraintErrors) {
        errors.push({
          type: "cell/jsonSchema",
          cell: String(row.source),
          fieldName: field.name,
          rowNumber: row.number,
          pointer: error.pointer,
          message: error.message,
        })
      }
    }
  }

  return errors
}
