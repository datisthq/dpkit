import type { Field } from "@dpkit/core"
import { lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { CellExclusiveMaximumError } from "../../error/index.ts"
import type { CellMaximumError } from "../../error/index.ts"

export function createCheckCellMaximum(options?: { isExclusive?: boolean }) {
  return (field: Field, target: Expr) => {
    if (field.type !== "integer" && field.type !== "number") return undefined

    const maximum = options?.isExclusive
      ? field.constraints?.exclusiveMaximum
      : field.constraints?.maximum
    if (maximum === undefined) return undefined

    let isErrorExpr: Expr
    const parser =
      field.type === "integer" ? Number.parseInt : Number.parseFloat

    try {
      const parsedMaximum =
        typeof maximum === "string" ? parser(maximum) : maximum

      isErrorExpr = options?.isExclusive
        ? target.gtEq(parsedMaximum)
        : target.gt(parsedMaximum)
    } catch (error) {
      isErrorExpr = lit(true)
    }

    const errorTemplate: CellMaximumError | CellExclusiveMaximumError = {
      type: options?.isExclusive ? "cell/exclusiveMaximum" : "cell/maximum",
      fieldName: field.name,
      rowNumber: 0,
      cell: "",
    }

    return { isErrorExpr, errorTemplate }
  }
}
