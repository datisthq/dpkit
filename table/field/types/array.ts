import type { ArrayField } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: Is there a better way to do this?
// Polars does not support really support free-form JSON
// So we just make a basic check and return as it is
export function parseArrayField(field: ArrayField, expr?: Expr) {
  expr = expr ?? col(field.name)

  return when(expr.str.contains("^\\[")).then(expr).otherwise(lit(null))
}
