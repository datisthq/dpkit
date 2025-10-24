import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseField } from "./parse.ts"

const DEFAULT_MISSING_VALUES = [""]

export function normalizeField(
  field: Field,
  expr?: Expr,
  options?: { dontParse?: boolean },
) {
  expr = expr ?? col(field.name)

  const flattenMissingValues =
    field.missingValues?.map(it => (typeof it === "string" ? it : it.value)) ??
    DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    expr = when(expr.isIn(flattenMissingValues))
      .then(lit(null))
      .otherwise(expr)
      .alias(field.name)
  }

  if (options?.dontParse) {
    return expr
  }

  return parseField(field, expr)
}
