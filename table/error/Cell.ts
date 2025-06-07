import type { BaseTableError } from "./Base.js"

export interface BaseCellError extends BaseTableError {
  cell: string
  fieldName: string
  rowNumber: number
}

export interface CellTypeError extends BaseCellError {
  type: "cell/type"
}

export interface CellConstraintError extends BaseCellError {
  type: "cell/constraint"
  category:
    | "required"
    | "unique"
    | "minLength"
    | "maxLength"
    | "minimum"
    | "maximum"
    | "exclusiveMinimum"
    | "exclusiveMaximum"
    | "jsonSchema"
    | "pattern"
    | "enum"
}
