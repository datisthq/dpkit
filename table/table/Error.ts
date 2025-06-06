export type TableError = StructureError

export interface BaseTableError {
  type: string
  message: string
}

export interface StructureError extends BaseTableError {
  type: "structure"
}
