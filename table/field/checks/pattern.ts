import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellPatternError } from "../../error/index.ts"

export function checkCellPattern(field: Field, target: Expr) {
  if (field.type !== "string") return undefined

  const pattern = field.constraints?.pattern
  if (!pattern) return undefined

  const isErrorExpr = target.str.contains(pattern).not()

  const errorTemplate: CellPatternError = {
    type: "cell/pattern",
    fieldName: field.name,
    pattern: pattern,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
