import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { desubstituteField } from "./desubstitute.ts"
import { stringifyField } from "./stringify.ts"

export function denormalizeField(field: Field, fieldExpr?: Expr) {
  let expr = fieldExpr ?? col(field.name)

  expr = stringifyField(field, expr)
  expr = desubstituteField(field, expr)

  return expr
}
