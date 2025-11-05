import type { Field } from "@dpkit/metadata"
import type { CellExclusiveMinimumError } from "@dpkit/metadata"
import type { CellMinimumError } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseDateField } from "../types/date.ts"
import { parseDatetimeField } from "../types/datetime.ts"
import { parseIntegerField } from "../types/integer.ts"
import { parseNumberField } from "../types/number.ts"
import { parseTimeField } from "../types/time.ts"
import { parseYearField } from "../types/year.ts"
import { parseYearmonthField } from "../types/yearmonth.ts"

export function createCheckCellMinimum(options?: { isExclusive?: boolean }) {
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

    const minimum = options?.isExclusive
      ? field.constraints?.exclusiveMinimum
      : field.constraints?.minimum
    if (minimum === undefined) return undefined

    let isErrorExpr: pl.Expr
    try {
      const parsedMinimum = parseConstraint(field, minimum)
      isErrorExpr = options?.isExclusive
        ? mapping.target.ltEq(parsedMinimum)
        : mapping.target.lt(parsedMinimum)
    } catch (error) {
      isErrorExpr = pl.pl.lit(true)
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

function parseConstraint(field: Field, value: number | string) {
  if (typeof value !== "string") return value

  let expr = pl.pl.lit(value)
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
