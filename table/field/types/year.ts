import type { YearField } from "@dpkit/core"
import { DataType, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseYearField(_field: YearField, fieldExpr: Expr) {
  fieldExpr = when(fieldExpr.str.lengths().eq(4))
    .then(fieldExpr)
    .otherwise(lit(null))
    .cast(DataType.Int16)

  return when(fieldExpr.gtEq(0).and(fieldExpr.ltEq(9999)))
    .then(fieldExpr)
    .otherwise(lit(null))
}

export function stringifyYearField(_field: YearField, fieldExpr: Expr) {
  return fieldExpr.cast(DataType.String).str.zFill(4)
}
