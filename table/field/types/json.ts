import type { ArrayField, GeojsonField, ObjectField } from "@dpkit/core"
import { validateDescriptor } from "@dpkit/core"
import * as pl from "nodejs-polars"
import type { CellError } from "../../error/index.ts"
import { isObject } from "../../helpers.ts"
import type { Table } from "../../table/index.ts"

// TODO: Improve the implementation
// Make unblocking / handle large data / process in parallel / move processing to Rust?

export async function validateJsonField(
  field: ArrayField | GeojsonField | ObjectField,
  table: Table,
) {
  const errors: CellError[] = []
  const jsonSchema = field.constraints?.jsonSchema

  const frame = await table
    .withRowCount()
    .select(
      pl.col("row_nr").add(1).alias("number"),
      pl.col(field.name).alias("source"),
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
        fieldType: "object",
        rowNumber: row.number,
      })

      continue
    }

    if (jsonSchema) {
      // TODO: Extract more generic function validateJson?
      // @ts-ignore
      const report = await validateDescriptor(target, { profile: jsonSchema })

      if (!report.valid) {
        errors.push({
          type: "cell/jsonSchema",
          cell: String(row.source),
          fieldName: field.name,
          rowNumber: row.number,
          jsonSchema,
        })
      }
    }
  }

  return errors
}
