import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

export function isCellPatternError(field: Field, target: Expr) {
  if (field.type === "string") {
    const pattern = field.constraints?.pattern

    if (pattern === undefined) {
      return lit(false)
    }

    return target.str.contains(pattern).not()
  }

  return lit(false)
}
