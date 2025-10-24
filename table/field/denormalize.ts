import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { stringifyField } from "./stringify.ts"

const DEFAULT_MISSING_VALUE = ""

export function denormalizeField(field: Field, expr?: Expr) {
  expr = expr ?? col(field.name)
  expr = stringifyField(field, expr)

  const flattenMissingValues = field.missingValues?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  const missingValue = flattenMissingValues?.[0] ?? DEFAULT_MISSING_VALUE
  expr = when(expr.isNull())
    .then(lit(missingValue))
    .otherwise(expr)
    .alias(field.name)

  return expr
}
