import * as pl from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"

const DEFAULT_MISSING_VALUES = [""]

export function substituteField(mapping: FieldMapping, fieldExpr: pl.Expr) {
  if (!mapping.source.type.equals(pl.String)) return fieldExpr

  const flattenMissingValues =
    mapping.target.missingValues?.map(it =>
      typeof it === "string" ? it : it.value,
    ) ?? DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    fieldExpr = pl
      .when(fieldExpr.isIn(flattenMissingValues))
      .then(pl.lit(null))
      .otherwise(fieldExpr)
      .alias(mapping.target.name)
  }

  return fieldExpr
}
