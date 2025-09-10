import type { YearmonthField } from "@dpkit/core"
import { DataType, col, concatString } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are year and month limits
// - Return null instead of list if any of the values are out of range
// - Rebase on Struct when lst.toStruct() is available?

export function parseYearmonthField(field: YearmonthField, expr?: Expr) {
  expr = expr ?? col(field.name)

  expr = expr.str.split("-").cast(DataType.List(DataType.Int16))

  return expr
}

export function stringifyYearmonthField(field: YearmonthField, expr?: Expr) {
  expr = expr ?? col(field.name)

  // TODO: remove int casting when resolved:
  // https://github.com/pola-rs/nodejs-polars/issues/362
  return concatString(
    [
      expr.lst.get(0).cast(DataType.Int16).cast(DataType.String).str.zFill(4),
      expr.lst.get(1).cast(DataType.Int16).cast(DataType.String).str.zFill(2),
    ],
    "-",
  ).alias(field.name) as Expr
}
