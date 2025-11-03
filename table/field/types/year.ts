import type { YearField } from "@dpkit/core"
import * as pl from "nodejs-polars"

export function parseYearField(_field: YearField, fieldExpr: pl.Expr) {
  fieldExpr = pl
    .when(fieldExpr.str.lengths().eq(4))
    .then(fieldExpr)
    .otherwise(pl.lit(null))
    .cast(pl.DataType.Int16)

  return pl
    .when(fieldExpr.gtEq(0).and(fieldExpr.ltEq(9999)))
    .then(fieldExpr)
    .otherwise(pl.lit(null))
}

export function stringifyYearField(_field: YearField, fieldExpr: pl.Expr) {
  return fieldExpr.cast(pl.DataType.String).str.zFill(4)
}
