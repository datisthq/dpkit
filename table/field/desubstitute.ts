import type { Field } from "@dpkit/core"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_MISSING_VALUE = ""

export function desubstituteField(field: Field, fieldExpr: Expr) {
  const flattenMissingValues = field.missingValues?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  const missingValue = flattenMissingValues?.[0] ?? DEFAULT_MISSING_VALUE
  fieldExpr = when(fieldExpr.isNull())
    .then(lit(missingValue))
    .otherwise(fieldExpr)
    .alias(field.name)

  return fieldExpr
}
