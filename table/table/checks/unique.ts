import { concatList } from "nodejs-polars"
import type { RowUniqueError } from "../../error/index.ts"
import type { SchemaMapping } from "../../schema/index.ts"

export function createChecksRowUnique(mapping: SchemaMapping) {
  const uniqueKeys = mapping.target.uniqueKeys ?? []

  if (mapping.target.primaryKey) {
    uniqueKeys.push(mapping.target.primaryKey)
  }

  return uniqueKeys.map(createCheckRowUnique)
}

function createCheckRowUnique(uniqueKey: string[]) {
  const isErrorExpr = concatList(uniqueKey)
    .isFirstDistinct()
    .not()
    // Fold is not available so we use a tricky way to eliminate nulls
    .and(concatList(uniqueKey).lst.min().isNotNull())

  const errorTemplate: RowUniqueError = {
    type: "row/unique",
    fieldNames: uniqueKey,
    rowNumber: 0,
  }

  return { isErrorExpr, errorTemplate }
}
