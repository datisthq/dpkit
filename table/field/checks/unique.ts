import type { Field } from "@dpkit/core"
import type { CellUniqueError } from "../../error/index.ts"
import type { CellMapping } from "../Mapping.ts"

// TODO: Support schema.primaryKey and schema.uniqueKeys
export function checkCellUnique(field: Field, mapping: CellMapping) {
  const unique = field.constraints?.unique
  if (!unique) return undefined

  const isErrorExpr = mapping.target
    .isNotNull()
    .and(mapping.target.isFirstDistinct().not())

  const errorTemplate: CellUniqueError = {
    type: "cell/unique",
    fieldName: field.name,
    rowNumber: 0,
    cell: "",
  }

  return { isErrorExpr, errorTemplate }
}
