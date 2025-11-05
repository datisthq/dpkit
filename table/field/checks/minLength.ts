import type { Field } from "@dpkit/metadata"
import type { CellMinLengthError } from "@dpkit/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellMinLength(field: Field, mapping: CellMapping) {
  if (field.type !== "string") return undefined

  const minLength = field.constraints?.minLength
  if (!minLength) return undefined

  const isErrorExpr = mapping.target.str.lengths().lt(minLength)

  const errorTemplate: CellMinLengthError = {
    type: "cell/minLength",
    fieldName: field.name,
    minLength: minLength,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
