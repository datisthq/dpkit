import type { Expr } from "nodejs-polars"
import * as pl from "nodejs-polars"

export function arrayDiff(a: string[], b: string[]) {
  return a.filter(x => !b.includes(x))
}

export function evaluateExpression(expr: Expr) {
  // @ts-ignore
  return pl.select(expr.alias("value")).toRecords()[0].value
}
