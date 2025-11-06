import type { Field } from "@dpkit/metadata"
import type { CellMaxLengthError } from "@dpkit/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellMaxLength(field: Field, mapping: CellMapping) {
  if (field.type !== "string") return undefined

  const maxLength = field.constraints?.maxLength
  if (!maxLength) return undefined

  const isErrorExpr = mapping.target.str.lengths().gt(maxLength)

  const errorTemplate: CellMaxLengthError = {
    type: "cell/maxLength",
    fieldName: field.name,
    maxLength: maxLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
