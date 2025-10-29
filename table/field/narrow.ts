import { DataType } from "nodejs-polars"
import { lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"

export function narrowField(mapping: FieldMapping, fieldExpr: Expr) {
  const variant = mapping.source.type.variant

  if (mapping.target.type === "integer") {
    if (["Float32", "Float64"].includes(variant)) {
      fieldExpr = when(fieldExpr.eq(fieldExpr.round(0)))
        .then(fieldExpr.cast(DataType.Int64))
        .otherwise(lit(null))
    }
  }

  return fieldExpr
}
