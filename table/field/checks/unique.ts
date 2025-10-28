import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellUniqueError } from "../../error/index.ts"

// TODO: Support schema.primaryKey and schema.uniqueKeys
export function checkCellUnique(field: Field, target: Expr) {
  const unique = field.constraints?.unique
  if (!unique) return undefined

  const isErrorExpr = target.isNotNull().and(target.isFirstDistinct().not())

  const errorTemplate: CellUniqueError = {
    type: "cell/unique",
    fieldName: field.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
