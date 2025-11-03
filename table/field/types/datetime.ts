import type { DatetimeField } from "@dpkit/core"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

// TODO: Add support for timezone handling
export function parseDatetimeField(field: DatetimeField, fieldExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return fieldExpr.str.strptime(pl.DataType.Datetime, format)
}

export function stringifyDatetimeField(
  field: DatetimeField,
  fieldExpr: pl.Expr,
) {
  const format = field.format ?? DEFAULT_FORMAT

  return fieldExpr.date.strftime(format)
}
