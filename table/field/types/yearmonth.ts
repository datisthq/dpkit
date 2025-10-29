import type { YearmonthField } from "@dpkit/core"
import { DataType, concatString } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are year and month limits
// - Return null instead of list if any of the values are out of range
// - Rebase on Struct when lst.toStruct() is available?

export function parseYearmonthField(_field: YearmonthField, fieldExpr: Expr) {
  fieldExpr = fieldExpr.str.split("-").cast(DataType.List(DataType.Int16))

  return fieldExpr
}

export function stringifyYearmonthField(
  field: YearmonthField,
  fieldExpr: Expr,
) {
  // TODO: remove int casting when resolved:
  // https://github.com/pola-rs/nodejs-polars/issues/362
  return concatString(
    [
      fieldExpr.lst
        .get(0)
        .cast(DataType.Int16)
        .cast(DataType.String)
        .str.zFill(4),
      fieldExpr.lst
        .get(1)
        .cast(DataType.Int16)
        .cast(DataType.String)
        .str.zFill(2),
    ],
    "-",
  ).alias(field.name) as Expr
}
