import type { BaseTableError } from "./Base.js"

export interface BaseFieldsError extends BaseTableError {
  fieldNames: string[]
}

export interface FieldsMissingError extends BaseFieldsError {
  type: "fields/missing"
}

export interface FieldsExtraError extends BaseFieldsError {
  type: "fields/extra"
}
