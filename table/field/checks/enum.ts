import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import * as pl from "nodejs-polars"
import type { CellEnumError } from "../../error/index.ts"
import { evaluateExpression } from "../../helpers.ts"
import type { CellMapping } from "../Mapping.ts"
import { parseDateField } from "../types/date.ts"
import { parseDatetimeField } from "../types/datetime.ts"
import { parseIntegerField } from "../types/integer.ts"
import { parseNumberField } from "../types/number.ts"
import { parseTimeField } from "../types/time.ts"
import { parseYearField } from "../types/year.ts"
import { parseYearmonthField } from "../types/yearmonth.ts"

export function checkCellEnum(field: Field, mapping: CellMapping) {
  if (
    field.type !== "string" &&
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

  const rawEnum = field.constraints?.enum
  if (!rawEnum) return undefined

  let isErrorExpr: Expr
  try {
    const parsedEnum = parseConstraint(field, rawEnum)
    isErrorExpr = mapping.target.isIn(parsedEnum).not()
  } catch (error) {
    isErrorExpr = pl.lit(true)
  }

  const errorTemplate: CellEnumError = {
    type: "cell/enum",
    fieldName: field.name,
    enum: rawEnum.map(String),
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}

function parseConstraint(field: Field, value: number[] | string[]) {
  return value.map(it => parseConstraintItem(field, it))
}

function parseConstraintItem(field: Field, value: number | string) {
  if (typeof value !== "string") return value

  let expr = pl.lit(value)
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
