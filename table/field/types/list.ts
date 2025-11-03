import type { ListField } from "@dpkit/core"
import * as pl from "nodejs-polars"

// TODO:
// Add more validation:
// - Return null instead of list if all array values are nulls?
export function parseListField(field: ListField, fieldExpr: pl.Expr) {
  const delimiter = field.delimiter ?? ","
  const itemType = field.itemType

  let dtype: any = pl.String
  if (itemType === "integer") dtype = pl.Int64
  if (itemType === "number") dtype = pl.Float64
  if (itemType === "boolean") dtype = pl.Bool
  if (itemType === "datetime") dtype = pl.Datetime
  if (itemType === "date") dtype = pl.Date
  if (itemType === "time") dtype = pl.Time

  fieldExpr = fieldExpr.str.split(delimiter).cast(pl.List(dtype))

  return fieldExpr
}

export function stringifyListField(field: ListField, fieldExpr: pl.Expr) {
  const delimiter = field.delimiter ?? ","

  return fieldExpr
    .cast(pl.List(pl.String))
    .lst.join({ separator: delimiter, ignoreNulls: true })
}
