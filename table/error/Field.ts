import type { Field } from "@dpkit/core"
import type { BaseTableError } from "./Base.js"

export interface FieldNameError extends BaseTableError {
  type: "field/name"
  fieldName: string
  actualFieldName: string
}

export interface FieldTypeError extends BaseTableError {
  type: "field/type"
  fieldType: Field["type"]
  actualFieldType: Field["type"]
}
