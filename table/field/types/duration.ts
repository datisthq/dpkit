import type { DurationField } from "@dpkit/core"
import type { Expr } from "nodejs-polars"

// TODO: raise an issue on nodejs-polars repo as this is not supported yet
// So we do nothing on this column type for now
export function parseDurationField(_field: DurationField, fieldExpr: Expr) {
  return fieldExpr
}

export function stringifyDurationField(_field: DurationField, fieldExpr: Expr) {
  return fieldExpr
}
