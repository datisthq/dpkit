import type { BooleanField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_TRUE_VALUES = ["true", "True", "TRUE", "1"]
const DEFAULT_FALSE_VALUES = ["false", "False", "FALSE", "0"]

export function parseBooleanColumn(props: {
  field: BooleanField
  expr?: Expr
}) {
  const { field } = props
  let expr = props.expr ?? col(field.name)

  const trueValues = field.trueValues || DEFAULT_TRUE_VALUES
  const falseValues = field.falseValues || DEFAULT_FALSE_VALUES
  trueValues
  falseValues

  expr = expr.cast(DataType.Bool)
  return expr
}
