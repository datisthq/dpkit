import type { DatetimeField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

// TODO: Add support for timezone handling
export function parseDatetimeField(field: DatetimeField, expr?: Expr) {
  expr = expr ?? col(field.name)

  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return expr.str.strptime(DataType.Datetime, format)
}

export function stringifyDatetimeField(field: DatetimeField, expr?: Expr) {
  expr = expr ?? col(field.name)

  const format = field.format ?? DEFAULT_FORMAT

  return expr.dt.strftime(format)
}
