import type {
  CellExclusiveMaximumError,
  CellExclusiveMinimumError,
  CellMaxLengthError,
  CellMaximumError,
  CellMinLengthError,
  CellMinimumError,
  CellPatternError,
  CellRequiredError,
  CellTypeError,
  CellUniqueError,
} from "./Cell.js"
import type { FieldNameError, FieldTypeError } from "./Field.js"
import type { FieldsError } from "./Fields.js"

export type TableError =
  | FieldsError
  | FieldNameError
  | FieldTypeError
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
