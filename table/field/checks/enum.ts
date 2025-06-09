import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellEnum(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const rawEnum = field.constraints?.enum

    if (rawEnum) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/enum:${field.name}`

      errorTable = errorTable
        .withColumn(target.isIn(rawEnum).not().alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return errorTable
}
