import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellUnique(table: Table, field: Field) {
  const unique = field.constraints?.unique

  if (unique) {
    const target = col(`target:${field.name}`)
    const column = `error:cell/unique:${field.name}`

    table = table
      .withColumn(
        when(target.isNotNull())
          .then(target.isFirstDistinct().not())
          .otherwise(lit(false))
          .alias(column),
      )
      .withColumn(col("error").or(col(column)).alias("error"))
  }

  return table
}
