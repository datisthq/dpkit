export type TableError = ColumnError

export interface BaseTableError {
  type: string
  message: string
}

export interface ColumnError extends BaseTableError {
  type: "column"
  fieldName: string
}
