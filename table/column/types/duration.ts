import type { DurationField } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: raise an issue on nodejs-polars repo as this is not supported yet
// So we do nothing on this column type for now
export function parseDurationColumn(
  field: DurationField,
  options?: { expr?: Expr },
) {
  let expr = options?.expr ?? col(field.name)

  // Trim whitespace
  expr = expr.str.strip()

  return expr
}
