import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.ts"

export function checkCellMaxLength(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const maxLength = field.constraints?.maxLength

    if (maxLength !== undefined) {
      const target = col(`target:${field.name}`)
      const errorName = `error:cell/maxLength:${field.name}`

      errorTable = errorTable.withColumn(
        target.str.lengths().gt(maxLength).alias(errorName),
      )
    }
  }

  return errorTable
}
