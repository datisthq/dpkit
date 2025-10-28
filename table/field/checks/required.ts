import type { Field } from "@dpkit/core"
import type { CellRequiredError } from "../../error/index.ts"
import type { Expr } from "nodejs-polars"

export function checkCellRequired(field: Field, target: Expr) {
  const required = field.constraints?.required
  if (!required) return undefined

  const isErrorExpr = target.isNull()

  const errorTemplate: CellRequiredError = {
    type: "cell/required",
    fieldName: field.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
