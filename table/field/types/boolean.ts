import type { BooleanField } from "@dpkit/core"
import * as pl from "nodejs-polars"

const DEFAULT_TRUE_VALUES = ["true", "True", "TRUE", "1"]
const DEFAULT_FALSE_VALUES = ["false", "False", "FALSE", "0"]

export function parseBooleanField(field: BooleanField, fieldExpr: pl.Expr) {
  const trueValues = field.trueValues ?? DEFAULT_TRUE_VALUES
  const falseValues = field.falseValues ?? DEFAULT_FALSE_VALUES

  for (const value of trueValues) fieldExpr = fieldExpr.replace(value, "1")
  for (const value of falseValues) fieldExpr = fieldExpr.replace(value, "0")

  fieldExpr = fieldExpr.cast(pl.DataType.Int8)

  return pl
    .when(fieldExpr.eq(1))
    .then(pl.lit(true))
    .when(fieldExpr.eq(0))
    .then(pl.lit(false))
    .otherwise(pl.lit(null))
    .alias(field.name)
}

const DEFAULT_TRUE_VALUE = "true"
const DEFAULT_FALSE_VALUE = "false"

export function stringifyBooleanField(field: BooleanField, fieldExpr: pl.Expr) {
  const trueValue = field.trueValues?.[0] ?? DEFAULT_TRUE_VALUE
  const falseValue = field.falseValues?.[0] ?? DEFAULT_FALSE_VALUE

  return pl
    .when(fieldExpr.eq(pl.lit(true)))
    .then(pl.lit(trueValue))
    .otherwise(pl.lit(falseValue))
    .alias(field.name)
}
