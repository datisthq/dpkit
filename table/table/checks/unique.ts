import type { RowUniqueError } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import type { SchemaMapping } from "../../schema/index.ts"

export function createChecksRowUnique(mapping: SchemaMapping) {
  const uniqueKeys = mapping.target.uniqueKeys ?? []

  if (mapping.target.primaryKey) {
    uniqueKeys.push(mapping.target.primaryKey)
  }

  return uniqueKeys.map(createCheckRowUnique)
}

function createCheckRowUnique(uniqueKey: string[]) {
  const isErrorExpr = pl
    .concatList(uniqueKey)
    .isFirstDistinct()
    .not()
    // Fold is not available so we use a tricky way to eliminate nulls
    .and(pl.concatList(uniqueKey).lst.min().isNotNull())

  const errorTemplate: RowUniqueError = {
    type: "row/unique",
    fieldNames: uniqueKey,
    rowNumber: 0,
  }

  return { isErrorExpr, errorTemplate }
}
