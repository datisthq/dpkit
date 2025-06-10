import type { BaseTableError } from "./Base.js"

export interface BaseRowError extends BaseTableError {
  rowNumber: number
}

export interface RowUniqueError extends BaseRowError {
  type: "row/unique"
  fieldNames: string[]
}
