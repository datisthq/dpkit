import type { Field } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellMinimum(
  field: Field,
  errorTable: Table,
  options?: {
    isExclusive?: boolean
  },
) {
  if (field.type === "integer" || field.type === "number") {
    const minimum = options?.isExclusive
      ? field.constraints?.exclusiveMinimum
      : field.constraints?.minimum

    if (minimum !== undefined) {
      const target = col(`target:${field.name}`)
      const column = options?.isExclusive
        ? `error:cell/exclusiveMinimum:${field.name}`
        : `error:cell/minimum:${field.name}`

      const parser =
        field.type === "integer" ? Number.parseInt : Number.parseFloat

      try {
        const parsedMinimum =
          typeof minimum === "string" ? parser(minimum) : minimum

        errorTable = errorTable
          .withColumn(
            options?.isExclusive
              ? target.ltEq(parsedMinimum).alias(column)
              : target.lt(parsedMinimum).alias(column),
          )
          .withColumn(col("error").or(col(column)).alias("error"))
      } catch (error) {
        errorTable = errorTable
          .withColumn(lit(true).alias(column))
          .withColumn(lit(true).alias("error"))
      }
    }
  }

  return errorTable
}
