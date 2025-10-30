import { DataType } from "nodejs-polars"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"

const DEFAULT_MISSING_VALUES = [""]

export function substituteField(mapping: FieldMapping, fieldExpr: Expr) {
  if (!mapping.source.type.equals(DataType.String)) return fieldExpr

  const flattenMissingValues =
    mapping.target.missingValues?.map(it =>
      typeof it === "string" ? it : it.value,
    ) ?? DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    fieldExpr = when(fieldExpr.isIn(flattenMissingValues))
      .then(lit(null))
      .otherwise(fieldExpr)
      .alias(mapping.target.name)
  }

  return fieldExpr
}
