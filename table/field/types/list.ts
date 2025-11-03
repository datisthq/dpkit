import type { ListField } from "@dpkit/core"
import * as pl from "nodejs-polars"

// TODO:
// Add more validation:
// - Return null instead of list if all array values are nulls?
export function parseListField(field: ListField, fieldExpr: pl.Expr) {
  const delimiter = field.delimiter ?? ","
  const itemType = field.itemType

  let dtype: any = pl.DataType.String
  if (itemType === "integer") dtype = pl.DataType.Int64
  if (itemType === "number") dtype = pl.DataType.Float64
  if (itemType === "boolean") dtype = pl.DataType.Bool
  if (itemType === "datetime") dtype = pl.DataType.Datetime
  if (itemType === "date") dtype = pl.DataType.Date
  if (itemType === "time") dtype = pl.DataType.Time

  fieldExpr = fieldExpr.str.split(delimiter).cast(pl.DataType.List(dtype))

  return fieldExpr
}

export function stringifyListField(field: ListField, fieldExpr: pl.Expr) {
  const delimiter = field.delimiter ?? ","

  return fieldExpr
    .cast(pl.DataType.List(pl.DataType.String))
    .lst.join({ separator: delimiter, ignoreNulls: true })
}
