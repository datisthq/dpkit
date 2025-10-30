import type { GeojsonField } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: Is there a better way to do this?
// Polars does not support really support free-form JSON
// So we just make a basic check and return as it is
export function parseGeojsonField(_field: GeojsonField, fieldExpr: Expr) {
  return when(fieldExpr.str.contains("^\\{"))
    .then(fieldExpr)
    .otherwise(lit(null))
}

export function stringifyGeojsonField(_field: GeojsonField, fieldExpr: Expr) {
  return fieldExpr
}
