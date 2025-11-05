import type { FieldType } from "../../field/index.ts"
import type { BaseError } from "./Base.ts"

export type FieldError = FieldNameError | FieldTypeError

export interface BaseFieldError extends BaseError {
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
