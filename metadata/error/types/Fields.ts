import type { BaseError } from "./Base.ts"

export type FieldsError = FieldsMissingError | FieldsExtraError

export interface BaseFieldsError extends BaseError {
  fieldNames: string[]
}

export interface FieldsMissingError extends BaseFieldsError {
  type: "fields/missing"
}

export interface FieldsExtraError extends BaseFieldsError {
  type: "fields/extra"
}
