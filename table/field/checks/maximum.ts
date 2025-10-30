import type { Field } from "@dpkit/core"
import * as pl from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { CellExclusiveMaximumError } from "../../error/index.ts"
import type { CellMaximumError } from "../../error/index.ts"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseDateField } from "../types/date.ts"
import { parseDatetimeField } from "../types/datetime.ts"
import { parseIntegerField } from "../types/integer.ts"
import { parseNumberField } from "../types/number.ts"
import { parseTimeField } from "../types/time.ts"
import { parseYearField } from "../types/year.ts"
import { parseYearmonthField } from "../types/yearmonth.ts"

export function createCheckCellMaximum(options?: { isExclusive?: boolean }) {
  return (field: Field, mapping: CellMapping) => {
    if (
      field.type !== "integer" &&
      field.type !== "number" &&
      field.type !== "date" &&
      field.type !== "time" &&
      field.type !== "datetime" &&
      field.type !== "year" &&
      field.type !== "yearmonth"
    ) {
      return undefined
    }

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
  } else if (field.type === "date") {
    expr = parseDateField(field, expr)
  } else if (field.type === "time") {
    expr = parseTimeField(field, expr)
  } else if (field.type === "datetime") {
    expr = parseDatetimeField(field, expr)
  } else if (field.type === "year") {
    expr = parseYearField(field, expr)
  } else if (field.type === "yearmonth") {
    expr = parseYearmonthField(field, expr)
  }

  return evaluateExpression(expr)
}
