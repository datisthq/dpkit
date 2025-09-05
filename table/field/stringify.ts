import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"

export function stringifyField(field: Field, expr?: Expr) {
  console.log(field)
  console.log(expr)
}
