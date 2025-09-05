import type { DateField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%d"

type DateFieldOptions = {
  dateFormat?: string
}

export function parseDateField(
  field: DateField,
  expr?: Expr,
  options?: DateFieldOptions,
) {
  expr = expr ?? col(field.name)

  let format = options?.dateFormat ?? DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return expr.str.strptime(DataType.Date, format)
}
