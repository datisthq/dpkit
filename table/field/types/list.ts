import type { ListField } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseListField(field: ListField, options?: { expr?: Expr }) {
  let expr = options?.expr ?? col(field.name)

  // Trim whitespace
  expr = expr.str.strip()

  const delimiter = field.delimiter ?? ","

  let dtype: any = DataType.String
  if (field.itemType === "integer") dtype = DataType.Int64
  if (field.itemType === "number") dtype = DataType.Float64
  if (field.itemType === "boolean") dtype = DataType.Bool
  if (field.itemType === "datetime") dtype = DataType.Datetime
  if (field.itemType === "date") dtype = DataType.Date
  if (field.itemType === "time") dtype = DataType.Time

  expr = expr.str.split(delimiter).cast(DataType.List(dtype))
  // TODO:
  // Add more validation:
  // - Return null instead of list if all array values are nulls?

  return expr
}
