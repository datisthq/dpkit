import type { FieldType } from "@dpkit/core"
import type { BaseTableError } from "./Base.ts"

export type FieldError = FieldNameError | FieldTypeError

export interface BaseFieldError extends BaseTableError {
  fieldName: string
}

export interface FieldNameError extends BaseFieldError {
  type: "field/name"
  actualFieldName: string
}

export interface FieldTypeError extends BaseFieldError {
  type: "field/type"
  fieldType: FieldType
  actualFieldType: FieldType
}
