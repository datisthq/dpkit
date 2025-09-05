import type { BooleanField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_TRUE_VALUES = ["true", "True", "TRUE", "1"]
const DEFAULT_FALSE_VALUES = ["false", "False", "FALSE", "0"]

type BooleanFieldOptions = {
  trueValues?: string[]
  falseValues?: string[]
}

export function parseBooleanField(
  field: BooleanField,
  expr?: Expr,
  options?: BooleanFieldOptions,
) {
  expr = expr ?? col(field.name)

  const trueValues =
    field.trueValues ?? options?.trueValues ?? DEFAULT_TRUE_VALUES
  const falseValues =
    field.falseValues ?? options?.falseValues ?? DEFAULT_FALSE_VALUES

  for (const value of trueValues) expr = expr.replace(value, "1")
  for (const value of falseValues) expr = expr.replace(value, "0")

  expr = expr.cast(DataType.Int8)

  return when(expr.eq(1))
    .then(lit(true))
    .when(expr.eq(0))
    .then(lit(false))
    .otherwise(lit(null))
    .alias(field.name)
}
