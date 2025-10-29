import type { Field } from "@dpkit/core"
import type { CellEnumError } from "../../error/index.ts"
import type { CellMapping } from "../Mapping.ts"

export function checkCellEnum(field: Field, mapping: CellMapping) {
  if (field.type !== "string") return undefined

  const rawEnum = field.constraints?.enum
  if (!rawEnum) return undefined

  const isErrorExpr = mapping.target.isIn(rawEnum).not()

  const errorTemplate: CellEnumError = {
    type: "cell/enum",
    fieldName: field.name,
    enum: rawEnum.map(String),
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
