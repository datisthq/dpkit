import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { col } from "nodejs-polars"

export function stringifyField(field: Field, expr?: Expr) {
  expr = expr ?? col(field.name)

  return expr
}
