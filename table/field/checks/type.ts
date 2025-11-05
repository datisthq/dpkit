import type { Field } from "@dpkit/metadata"
import type { CellTypeError } from "@dpkit/metadata"
import type { CellMapping } from "../Mapping.ts"

export function checkCellType(field: Field, mapping: CellMapping) {
  const isErrorExpr = mapping.source.isNotNull().and(mapping.target.isNull())

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
