import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
export function isCellMaxLenghtError(field: Field, target: Expr) {
  if (field.type === "string") {
    const maxLength = field.constraints?.maxLength

    if (maxLength === undefined) {
      return lit(false)
    }

    return target.str.lengths().gt(maxLength)
  }

  return lit(false)
}
