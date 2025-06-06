import type { BaseTableError } from "./Base.js"

export interface TypeError extends BaseTableError {
  type: "type"
  cell: string
  fieldName: string
  rowNumber: number
}
