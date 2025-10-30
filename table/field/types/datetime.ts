import type { DatetimeField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

// TODO: Add support for timezone handling
export function parseDatetimeField(field: DatetimeField, fieldExpr: Expr) {
  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return fieldExpr.str.strptime(DataType.Datetime, format)
}

export function stringifyDatetimeField(field: DatetimeField, fieldExpr: Expr) {
  const format = field.format ?? DEFAULT_FORMAT

  return fieldExpr.date.strftime(format)
}
