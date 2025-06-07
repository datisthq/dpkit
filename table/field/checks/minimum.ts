import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
export function isCellMinimumError(
  field: Field,
  target: Expr,
  isExclusive?: boolean,
) {
  if (field.type === "integer" || field.type === "number") {
    const minimum = isExclusive
      ? field.constraints?.exclusiveMinimum
      : field.constraints?.minimum

    if (minimum === undefined) {
      return lit(false)
    }

    const parser =
      field.type === "integer" ? Number.parseInt : Number.parseFloat

    try {
      const parsedMinimum =
        typeof minimum === "string" ? parser(minimum) : minimum
      return isExclusive ? target.ltEq(parsedMinimum) : target.lt(parsedMinimum)
    } catch (error) {
      return lit(true)
    }
  }

  return lit(false)
}
