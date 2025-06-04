import type { DatetimeField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_FORMAT = "%Y-%m-%dT%H:%M:%S"

export function parseDatetimeColumn(props: {
  field: DatetimeField
  expr?: Expr
}) {
  const { field } = props
  const expr = props.expr ?? col(field.name)

  let format = DEFAULT_FORMAT
  if (field.format && field.format !== "default" && field.format !== "any") {
    format = field.format
  }

  return expr.str.strptime(DataType.Datetime, format)
}

