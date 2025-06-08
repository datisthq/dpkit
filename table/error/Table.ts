import type {
  CellEnumError,
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
import type { RowUniqueError } from "./Row.js"

export type TableError =
  | FieldsError
  | FieldNameError
  | FieldTypeError
  | RowUniqueError
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
