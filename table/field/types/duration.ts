import type { DurationField } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: raise an issue on nodejs-polars repo as this is not supported yet
// So we do nothing on this column type for now
export function parseDurationField(field: DurationField, expr?: Expr) {
  expr = expr ?? col(field.name)

  return expr
}
