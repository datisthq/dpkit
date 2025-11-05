import type { FieldType } from "../../field/index.ts"
import type { BaseError } from "./Base.ts"

export type CellError =
  | CellTypeError
  | CellRequiredError
  | CellMinimumError
  | CellMaximumError
  | CellExclusiveMinimumError
  | CellExclusiveMaximumError
  | CellMinLengthError
  | CellMaxLengthError
  | CellPatternError
  | CellUniqueError
  | CellEnumError
  | CellJsonSchemaError

export interface BaseCellError extends BaseError {
  fieldName: string
  rowNumber: number
  cell: string
}

export interface CellTypeError extends BaseCellError {
  type: "cell/type"
  fieldType: FieldType
  fieldFormat?: string
}

export interface CellRequiredError extends BaseCellError {
  type: "cell/required"
}

export interface CellMinimumError extends BaseCellError {
  type: "cell/minimum"
  minimum: string
}

export interface CellMaximumError extends BaseCellError {
  type: "cell/maximum"
  maximum: string
}

export interface CellExclusiveMinimumError extends BaseCellError {
  type: "cell/exclusiveMinimum"
  minimum: string
}

export interface CellExclusiveMaximumError extends BaseCellError {
  type: "cell/exclusiveMaximum"
  maximum: string
}

export interface CellMinLengthError extends BaseCellError {
  type: "cell/minLength"
  minLength: number
}

export interface CellMaxLengthError extends BaseCellError {
  type: "cell/maxLength"
  maxLength: number
}

export interface CellPatternError extends BaseCellError {
  type: "cell/pattern"
  pattern: string
}

export interface CellUniqueError extends BaseCellError {
  type: "cell/unique"
}

export interface CellEnumError extends BaseCellError {
  type: "cell/enum"
  enum: string[]
}

export interface CellJsonSchemaError extends BaseCellError {
  type: "cell/jsonSchema"
  pointer: string
  message: string
}
