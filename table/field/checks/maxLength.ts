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

    try {
      const parsedMaxLength =
        typeof maxLength === "string" ? Number.parseInt(maxLength) : maxLength
      return target.gt(parsedMaxLength)
    } catch (error) {
      return lit(true)
    }
  }

  return lit(false)
}
