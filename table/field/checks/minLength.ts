import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
export function isCellMinLenghtError(field: Field, target: Expr) {
  if (field.type === "string") {
    const minLength = field.constraints?.minLength

    if (minLength === undefined) {
      return lit(false)
    }

    return target.str.lengths().lt(minLength)
  }

  return lit(false)
}
