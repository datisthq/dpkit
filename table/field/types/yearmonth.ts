import type { YearmonthField } from "@dpkit/core"
import { DataType, concatString } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseYearmonthField(_field: YearmonthField, fieldExpr: Expr) {
  fieldExpr = fieldExpr.str.split("-").cast(DataType.List(DataType.Int16))

  return fieldExpr
}

export function stringifyYearmonthField(
  field: YearmonthField,
  fieldExpr: Expr,
) {
  return concatString(
    [
      fieldExpr.lst.get(0).cast(DataType.String).str.zFill(4),
      fieldExpr.lst.get(1).cast(DataType.String).str.zFill(2),
    ],
    "-",
  ).alias(field.name) as Expr
}
