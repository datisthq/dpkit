import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
// TODO: Support checking field.categories?
export function isCellEnumError(field: Field, target: Expr) {
  if (field.type === "string") {
    const rawEnum = field.constraints?.enum

    if (rawEnum === undefined) {
      return lit(false)
    }

    return target.isIn(rawEnum).not()
  }

  return lit(false)
}
