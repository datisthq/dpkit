import type { ArrayField } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: Is there a better way to do this?
// Polars does not support really support free-form JSON
// So we just make a basic check and return as it is
export function parseArrayField(_field: ArrayField, fieldExpr: Expr) {
  return when(fieldExpr.str.contains("^\\["))
    .then(fieldExpr)
    .otherwise(lit(null))
}

export function stringifyArrayField(_field: ArrayField, fieldExpr: Expr) {
  // TODO: implement
  return fieldExpr
}
