import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { CellTypeError } from "../../error/index.ts"

export function checkCellType(field: Field) {
  const isErrorExpr = col("source").isNotNull().and(col("target").isNull())

  const errorTemplate: CellTypeError = {
    type: "cell/type",
    fieldName: field.name,
    fieldType: field.type ?? "any",
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
