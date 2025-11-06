import type { YearmonthField } from "@dpkit/metadata"
import * as pl from "nodejs-polars"

export function parseYearmonthField(
  _field: YearmonthField,
  fieldExpr: pl.Expr,
) {
  fieldExpr = fieldExpr.str.split("-").cast(pl.List(pl.Int16))

  return fieldExpr
}

export function stringifyYearmonthField(
  field: YearmonthField,
  fieldExpr: pl.Expr,
) {
  return pl
    .concatString(
      [
        fieldExpr.lst.get(0).cast(pl.String).str.zFill(4),
        fieldExpr.lst.get(1).cast(pl.String).str.zFill(2),
      ],
      "-",
    )
    .alias(field.name) as pl.Expr
}
