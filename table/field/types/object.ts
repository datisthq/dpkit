import type { ObjectField } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: Is there a better way to do this?
// Polars does not support really support free-form JSON
// So we just make a basic check and return as it is
export function parseObjectField(_field: ObjectField, fieldExpr: Expr) {
  return when(fieldExpr.str.contains("^\\{"))
    .then(fieldExpr)
    .otherwise(lit(null))
}

export function stringifyObjectField(_field: ObjectField, fieldExpr: Expr) {
  return fieldExpr
}
