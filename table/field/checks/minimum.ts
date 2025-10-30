import type { Field } from "@dpkit/core"
import * as pl from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { CellExclusiveMinimumError } from "../../error/index.ts"
import type { CellMinimumError } from "../../error/index.ts"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseIntegerField } from "../types/integer.ts"
import { parseNumberField } from "../types/number.ts"

export function createCheckCellMinimum(options?: { isExclusive?: boolean }) {
  return (field: Field, mapping: CellMapping) => {
    if (field.type !== "integer" && field.type !== "number") return undefined

    const minimum = options?.isExclusive
      ? field.constraints?.exclusiveMinimum
      : field.constraints?.minimum
    if (minimum === undefined) return undefined

    let isErrorExpr: Expr
    try {
      const parsedMinimum = parseConstraint(field, minimum)
      isErrorExpr = options?.isExclusive
        ? mapping.target.ltEq(parsedMinimum)
        : mapping.target.lt(parsedMinimum)
    } catch (error) {
      isErrorExpr = pl.lit(true)
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

function parseConstraint(field: Field, constraint: number | string) {
  let expr = pl.lit(constraint)

  if (field.type === "integer") {
    expr = parseIntegerField(field, expr)
  } else if (field.type === "number") {
    expr = parseNumberField(field, expr)
  }

  return evaluateExpression(expr)
}
