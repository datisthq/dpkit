import type { DateField } from "@dpkit/core"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%d"

export function parseDateField(field: DateField, fieldExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return fieldExpr.str.strptime(pl.DataType.Date, format)
}

export function stringifyDateField(field: DateField, fieldExpr: pl.Expr) {
  const format = field.format ?? DEFAULT_FORMAT

  return fieldExpr.date.strftime(format)
}
