import type { Field } from "@dpkit/core"
import * as pl from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { CellExclusiveMaximumError } from "../../error/index.ts"
import type { CellMaximumError } from "../../error/index.ts"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseIntegerField } from "../types/integer.ts"
import { parseNumberField } from "../types/number.ts"

export function createCheckCellMaximum(options?: { isExclusive?: boolean }) {
  return (field: Field, mapping: CellMapping) => {
    if (field.type !== "integer" && field.type !== "number") return undefined

    const maximum = options?.isExclusive
      ? field.constraints?.exclusiveMaximum
      : field.constraints?.maximum
    if (maximum === undefined) return undefined

    let isErrorExpr: Expr
    try {
      const parsedMaximum = parseConstraint(field, maximum)
      isErrorExpr = options?.isExclusive
        ? mapping.target.gtEq(parsedMaximum)
        : mapping.target.gt(parsedMaximum)
    } catch (error) {
      isErrorExpr = pl.lit(true)
    }

    const errorTemplate: CellMaximumError | CellExclusiveMaximumError = {
      type: options?.isExclusive ? "cell/exclusiveMaximum" : "cell/maximum",
      fieldName: field.name,
      maximum: String(maximum),
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
