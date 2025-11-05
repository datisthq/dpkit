import type { Field } from "@dpkit/metadata"
import * as pl from "nodejs-polars"

const DEFAULT_MISSING_VALUE = ""

export function desubstituteField(field: Field, fieldExpr: pl.Expr) {
  const flattenMissingValues = field.missingValues?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  const missingValue = flattenMissingValues?.[0] ?? DEFAULT_MISSING_VALUE
  fieldExpr = pl
    .when(fieldExpr.isNull())
    .then(pl.lit(missingValue))
    .otherwise(fieldExpr)
    .alias(field.name)

  return fieldExpr
}
