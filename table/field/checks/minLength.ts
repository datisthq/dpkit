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

    try {
      const parsedMinLength =
        typeof minLength === "string" ? Number.parseInt(minLength) : minLength
      return target.lt(parsedMinLength)
    } catch (error) {
      return lit(true)
    }
  }

  return lit(false)
}
