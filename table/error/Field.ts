import type { Field } from "@dpkit/core"
import type { BaseTableError } from "./Base.ts"

export interface BaseFieldError extends BaseTableError {
  fieldName: string
}

export interface FieldNameError extends BaseFieldError {
  type: "field/name"
  actualFieldName: string
}

export interface FieldTypeError extends BaseFieldError {
  type: "field/type"
  fieldType: Field["type"]
  actualFieldType: Field["type"]
}
