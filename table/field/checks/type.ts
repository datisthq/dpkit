import type { Expr } from "nodejs-polars"

export function detectCellTypeError(source: Expr, target: Expr) {
  return source.isNotNull().and(target.isNull())
}
