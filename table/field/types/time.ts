import type { TimeField } from "@dpkit/core"
import * as pl from "nodejs-polars"

const DEFAULT_FORMAT = "%H:%M:%S"

export function parseTimeField(field: TimeField, fieldExpr: pl.Expr) {
  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return pl.pl
    .concatString([pl.pl.lit("1970-01-01T"), fieldExpr], "")
    .str.strptime(pl.Datetime, `%Y-%m-%dT${format}`)
    .cast(pl.Time)
    .alias(field.name)
}

export function stringifyTimeField(field: TimeField, fieldExpr: pl.Expr) {
  const format = field.format ?? DEFAULT_FORMAT

  return fieldExpr.date.strftime(format)
}
