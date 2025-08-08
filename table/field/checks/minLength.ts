import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.ts"

export function checkCellMinLength(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const minLength = field.constraints?.minLength

    if (minLength !== undefined) {
      const target = col(`target:${field.name}`)
      const errorName = `error:cell/minLength:${field.name}`

      errorTable = errorTable
        .withColumn(target.str.lengths().lt(minLength).alias(errorName))
        .withColumn(col("error").or(col(errorName)).alias("error"))
    }
  }

  return errorTable
}
