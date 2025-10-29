import type { Field } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_MISSING_VALUES = [""]

export function substituteField(field: Field, expr: Expr) {
  const flattenMissingValues =
    field.missingValues?.map(it => (typeof it === "string" ? it : it.value)) ??
    DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    expr = when(expr.isIn(flattenMissingValues))
      .then(lit(null))
      .otherwise(expr)
      .alias(field.name)
  }

  return expr
}
