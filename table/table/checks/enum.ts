import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellEnum(table: Table, field: Field) {
  if (field.type === "string") {
    const rawEnum = field.constraints?.enum

    if (rawEnum) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/enum:${field.name}`

      table = table
        .withColumn(target.isIn(rawEnum).not().alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return table
}