import type { YearField } from "@dpkit/core"
import { DataType, lit, when } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseYearColumn(props: { field: YearField; expr?: Expr }) {
  const { field } = props
  let expr = props.expr ?? col(field.name)

  expr = expr.str.strip()

  expr = when(expr.str.lengths().eq(4))
    .then(expr)
    .otherwise(lit(null))
    .cast(DataType.Int16)

  return when(expr.gtEq(0).and(expr.ltEq(9999)))
    .then(expr)
    .otherwise(lit(null))
}
