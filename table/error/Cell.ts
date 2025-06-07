import type { BaseTableError } from "./Base.js"

export interface BaseCellError extends BaseTableError {
  fieldName: string
  rowNumber: number
  cell: string
}

export interface CellTypeError extends BaseCellError {
  type: "cell/type"
}

export interface CellRequiredError extends BaseCellError {
  type: "cell/required"
}
