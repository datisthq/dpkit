import type { Field } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_MISSING_VALUES = [""]

export function substituteField(field: Field, fieldExpr: Expr) {
  const flattenMissingValues =
    field.missingValues?.map(it => (typeof it === "string" ? it : it.value)) ??
    DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    fieldExpr = when(fieldExpr.isIn(flattenMissingValues))
      .then(lit(null))
      .otherwise(fieldExpr)
      .alias(field.name)
  }

  return fieldExpr
}
