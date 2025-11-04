import type { ArrayField, GeojsonField, ObjectField } from "@dpkit/core"
import { validateDescriptor } from "@dpkit/core"
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
    formatProfile?: Record<string, any>
  },
) {
  const errors: CellError[] = []

  const formatProfile = options?.formatProfile
  const constraintProfile = field.constraints?.jsonSchema

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
        rowNumber: row.number,
      })

      continue
    }

    if (formatProfile) {
      // TODO: Extract more generic function validateJson?
      const report = await validateDescriptor(target as any, {
        profile: formatProfile,
      })

      if (!report.valid) {
        errors.push({
          type: "cell/type",
          cell: String(row.source),
          fieldName: field.name,
          fieldType: field.type,
          rowNumber: row.number,
        })
      }

      continue
    }

    if (constraintProfile) {
      // TODO: Extract more generic function validateJson?
      const report = await validateDescriptor(target as any, {
        profile: constraintProfile,
      })

      for (const error of report.errors) {
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
