import type { TimeField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col, concatString, lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%H:%M:%S"

export function parseTimeField(field: TimeField, expr?: Expr) {
  expr = expr ?? col(field.name)

  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return concatString([lit("1970-01-01T"), expr], "")
    .str.strptime(DataType.Datetime, `%Y-%m-%dT${format}`)
    .cast(DataType.Time)
    .alias(field.name)
}

export function stringifyTimeField(field: TimeField, expr?: Expr) {
  expr = expr ?? col(field.name)

  const format = field.format ?? DEFAULT_FORMAT

  return expr.date.strftime(format)
}
