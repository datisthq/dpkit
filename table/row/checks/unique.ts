import type { Schema } from "@dpkit/core"
import { col, concatList } from "nodejs-polars"
import type { Table } from "../../table/Table.ts"

// TODO: fold is not available so we use a tricky way to eliminate list nulls
// TODO: Using comma as separator might rarely clash with comma in field names
export function checkRowUnique(schema: Schema, errorTable: Table) {
  const uniqueKeys = schema.uniqueKeys ?? []

  if (schema.primaryKey) {
    uniqueKeys.push(schema.primaryKey)
  }

  for (const uniqueKey of uniqueKeys) {
    const targetNames = uniqueKey.map(field => `target:${field}`)
    const errorName = `error:row/unique:${uniqueKey.join(",")}`

    errorTable = errorTable
      .withColumn(concatList(targetNames).alias(errorName))
      .withColumn(
        col(errorName)
          .lst.min()
          .isNull()
          .not()
          .and(col(errorName).isFirstDistinct().not())
          .alias(errorName),
      )
      .withColumn(col("error").or(col(errorName)).alias("error"))
  }

  return errorTable
}
