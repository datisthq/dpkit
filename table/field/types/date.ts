import type { DateField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%d"

export function parseDateField(field: DateField, expr?: Expr) {
  expr = expr ?? col(field.name)

  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return expr.str.strptime(DataType.Date, format)
}
