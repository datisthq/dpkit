import type { Expr } from "nodejs-polars"

export function isCellTypeError(source: Expr, target: Expr) {
  return source.isNotNull().and(target.isNull())
}
