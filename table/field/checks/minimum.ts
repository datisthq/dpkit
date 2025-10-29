import type { Field } from "@dpkit/core"
import { lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { CellExclusiveMinimumError } from "../../error/index.ts"
import type { CellMinimumError } from "../../error/index.ts"
import type { CellMapping } from "../Mapping.ts"

export function createCheckCellMinimum(options?: { isExclusive?: boolean }) {
  return (field: Field, mapping: CellMapping) => {
    if (field.type !== "integer" && field.type !== "number") return undefined

    const minimum = options?.isExclusive
      ? field.constraints?.exclusiveMinimum
      : field.constraints?.minimum
    if (minimum === undefined) return undefined

    let isErrorExpr: Expr
    const parser =
      field.type === "integer" ? Number.parseInt : Number.parseFloat

    try {
      const parsedMinimum =
        typeof minimum === "string" ? parser(minimum) : minimum

      isErrorExpr = options?.isExclusive
        ? mapping.target.ltEq(parsedMinimum)
        : mapping.target.lt(parsedMinimum)
    } catch (error) {
      isErrorExpr = lit(true)
    }

    const errorTemplate: CellMinimumError | CellExclusiveMinimumError = {
      type: options?.isExclusive ? "cell/exclusiveMinimum" : "cell/minimum",
      fieldName: field.name,
      minimum: String(minimum),
      rowNumber: 0,
      cell: "",
    }

    return { isErrorExpr, errorTemplate }
  }
}
