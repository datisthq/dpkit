import type { BaseError } from "./Base.ts"

export type RowError = RowUniqueError

export interface BaseRowError extends BaseError {
  rowNumber: number
}

export interface RowUniqueError extends BaseRowError {
  type: "row/unique"
  fieldNames: string[]
  // TODO: add cells?
}
