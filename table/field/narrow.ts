import * as pl from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"

export function narrowField(mapping: FieldMapping, fieldExpr: pl.Expr) {
  const variant = mapping.source.type.variant

  if (mapping.target.type === "integer") {
    if (["Float32", "Float64"].includes(variant)) {
      fieldExpr = pl
        .when(fieldExpr.eq(fieldExpr.round(0)))
        .then(fieldExpr.cast(pl.Int64))
        .otherwise(pl.lit(null))
    }
  }

  return fieldExpr
}
