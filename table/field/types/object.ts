import type { ObjectField } from "@dpkit/core"
import * as pl from "nodejs-polars"
import type { CellTypeError } from "../../error/index.ts"
import { isObject } from "../../helpers.ts"
import type { Table } from "../../table/index.ts"

// TODO: Improve the implementation
// Make unblocking / handle large data / process in parallel / move processing to Rust?

export async function validateObjectField(field: ObjectField, table: Table) {
  const errors: CellTypeError[] = []

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

    try {
      target = JSON.parse(row.source)
    } catch (error) {}

    if (!target || !isObject(target)) {
      errors.push({
        type: "cell/type",
        cell: String(row.source),
        fieldName: field.name,
        fieldType: "object",
        rowNumber: row.number,
      })
    }
  }

  return errors
}
