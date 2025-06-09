import type { Field } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellMaximum(
  field: Field,
  errorTable: Table,
  options?: {
    isExclusive?: boolean
  },
) {
  if (field.type === "integer" || field.type === "number") {
    const maximum = options?.isExclusive
      ? field.constraints?.exclusiveMaximum
      : field.constraints?.maximum

    if (maximum !== undefined) {
      const target = col(`target:${field.name}`)
      const column = options?.isExclusive
        ? `error:cell/exclusiveMaximum:${field.name}`
        : `error:cell/maximum:${field.name}`

      // TODO: Support numeric options (decimalChar, groupChar, etc)
      const parser =
        field.type === "integer" ? Number.parseInt : Number.parseFloat

      try {
        const parsedMaximum =
          typeof maximum === "string" ? parser(maximum) : maximum

        errorTable = errorTable
          .withColumn(
            options?.isExclusive
              ? target.gtEq(parsedMaximum).alias(column)
              : target.gt(parsedMaximum).alias(column),
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
