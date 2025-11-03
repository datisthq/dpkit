import type { Field } from "@dpkit/core"
import type { CellRequiredError } from "@dpkit/core"
import type { CellMapping } from "../Mapping.ts"

export function checkCellRequired(field: Field, mapping: CellMapping) {
  const required = field.constraints?.required
  if (!required) return undefined

  const isErrorExpr = mapping.target.isNull()

  const errorTemplate: CellRequiredError = {
    type: "cell/required",
    fieldName: field.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
