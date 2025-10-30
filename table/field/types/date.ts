import type { DateField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%d"

export function parseDateField(field: DateField, fieldExpr: Expr) {
  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return fieldExpr.str.strptime(DataType.Date, format)
}

export function stringifyDateField(field: DateField, fieldExpr: Expr) {
  const format = field.format ?? DEFAULT_FORMAT

  return fieldExpr.date.strftime(format)
}
