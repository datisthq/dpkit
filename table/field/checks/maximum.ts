import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
export function isCellMaximumError(
  field: Field,
  target: Expr,
  isExclusive?: boolean,
) {
  if (field.type === "integer" || field.type === "number") {
    const maximum = isExclusive
      ? field.constraints?.exclusiveMaximum
      : field.constraints?.maximum

    if (maximum === undefined) {
      return lit(false)
    }

    const parser =
      field.type === "integer" ? Number.parseInt : Number.parseFloat

    try {
      const parsedMaximum =
        typeof maximum === "string" ? parser(maximum) : maximum
      return isExclusive ? target.gt(parsedMaximum) : target.gtEq(parsedMaximum)
    } catch (error) {
      return lit(true)
    }
  }

  return lit(false)
}
