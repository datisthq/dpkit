import type { BooleanField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_TRUE_VALUES = ["true", "True", "TRUE", "1"]
const DEFAULT_FALSE_VALUES = ["false", "False", "FALSE", "0"]

export function parseBooleanField(field: BooleanField, fieldExpr: Expr) {
  const trueValues = field.trueValues ?? DEFAULT_TRUE_VALUES
  const falseValues = field.falseValues ?? DEFAULT_FALSE_VALUES

  for (const value of trueValues) fieldExpr = fieldExpr.replace(value, "1")
  for (const value of falseValues) fieldExpr = fieldExpr.replace(value, "0")

  fieldExpr = fieldExpr.cast(DataType.Int8)

  return when(fieldExpr.eq(1))
    .then(lit(true))
    .when(fieldExpr.eq(0))
    .then(lit(false))
    .otherwise(lit(null))
    .alias(field.name)
}

const DEFAULT_TRUE_VALUE = "true"
const DEFAULT_FALSE_VALUE = "false"

export function stringifyBooleanField(field: BooleanField, fieldExpr: Expr) {
  const trueValue = field.trueValues?.[0] ?? DEFAULT_TRUE_VALUE
  const falseValue = field.falseValues?.[0] ?? DEFAULT_FALSE_VALUE

  return when(fieldExpr.eq(lit(true)))
    .then(lit(trueValue))
    .otherwise(lit(falseValue))
    .alias(field.name)
}
