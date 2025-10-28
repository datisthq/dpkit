import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseField } from "./parse.ts"
import { substituteField } from "./substitute.ts"

export function normalizeField(field: Field, fieldExpr?: Expr) {
  let expr = fieldExpr ?? col(field.name)

  expr = substituteField(field, expr)
  expr = parseField(field, expr)

  return expr
}
