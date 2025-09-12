import type { ListField } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Return null instead of list if all array values are nulls?
export function parseListField(field: ListField, expr?: Expr) {
  expr = expr ?? col(field.name)

  const delimiter = field.delimiter ?? ","
  const itemType = field.itemType

  let dtype: any = DataType.String
  if (itemType === "integer") dtype = DataType.Int64
  if (itemType === "number") dtype = DataType.Float64
  if (itemType === "boolean") dtype = DataType.Bool
  if (itemType === "datetime") dtype = DataType.Datetime
  if (itemType === "date") dtype = DataType.Date
  if (itemType === "time") dtype = DataType.Time

  expr = expr.str.split(delimiter).cast(DataType.List(dtype))

  return expr
}

export function stringifyListField(field: ListField, expr?: Expr) {
  expr = expr ?? col(field.name)

  const delimiter = field.delimiter ?? ","

  return expr
    .cast(DataType.List(DataType.String))
    .lst.join({ separator: delimiter, ignoreNulls: true })
}
