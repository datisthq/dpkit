import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellEnumError } from "../../error/index.ts"

export function checkCellEnum(field: Field, target: Expr) {
  if (field.type !== "string") return undefined

  const rawEnum = field.constraints?.enum
  if (!rawEnum) return undefined

  const isErrorExpr = target.isIn(rawEnum).not()

  const errorTemplate: CellEnumError = {
    type: "cell/enum",
    fieldName: field.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
