import type { Field } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_MISSING_VALUE = ""

export function desubstituteField(field: Field, expr: Expr) {
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
