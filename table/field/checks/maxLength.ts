import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellMaxLengthError } from "../../error/index.ts"

export function checkCellMaxLength(field: Field, target: Expr) {
  if (field.type !== "string") return undefined

  const maxLength = field.constraints?.maxLength
  if (!maxLength) return undefined

  const isErrorExpr = target.str.lengths().gt(maxLength)

  const errorTemplate: CellMaxLengthError = {
    type: "cell/maxLength",
    fieldName: field.name,
    maxLength: maxLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
