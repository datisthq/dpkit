import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { CellTypeError } from "../../error/index.ts"

export function checkCellType(field: Field, target: Expr, source: Expr) {
  const isErrorExpr = source.isNotNull().and(target.isNull())

  const errorTemplate: CellTypeError = {
    type: "cell/type",
    fieldName: field.name,
    fieldType: field.type ?? "any",
    // @ts-ignore
    fieldFormat: field.format,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
