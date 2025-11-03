import type { DurationField } from "@dpkit/core"
import type * as pl from "nodejs-polars"

// TODO: raise an issue on nodejs-polars repo as this is not supported yet
// So we do nothing on this column type for now
export function parseDurationField(_field: DurationField, fieldExpr: pl.Expr) {
  return fieldExpr
}

export function stringifyDurationField(
  _field: DurationField,
  fieldExpr: pl.Expr,
) {
  return fieldExpr
}
