import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellMinLengthError } from "../../error/index.ts"

export function checkCellMinLength(field: Field, target: Expr) {
  if (field.type !== "string") return undefined

  const minLength = field.constraints?.minLength
  if (!minLength) return undefined

  const isErrorExpr = target.str.lengths().lt(minLength)

  const errorTemplate: CellMinLengthError = {
    type: "cell/minLength",
    fieldName: field.name,
    minLength: minLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
