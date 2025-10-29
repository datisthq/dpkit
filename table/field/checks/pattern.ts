import type { Field } from "@dpkit/core"
import type { CellPatternError } from "../../error/index.ts"
import type { CellMapping } from "../Mapping.ts"

export function checkCellPattern(field: Field, mapping: CellMapping) {
  if (field.type !== "string") return undefined

  const pattern = field.constraints?.pattern
  if (!pattern) return undefined

  const isErrorExpr = mapping.target.str.contains(pattern).not()

  const errorTemplate: CellPatternError = {
    type: "cell/pattern",
    fieldName: field.name,
    pattern: pattern,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
