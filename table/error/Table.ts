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
} from "./Cell.ts"
import type { FieldNameError, FieldTypeError } from "./Field.ts"
import type { FieldsExtraError, FieldsMissingError } from "./Fields.ts"
import type { RowUniqueError } from "./Row.ts"

export type TableError =
  | FieldsMissingError
  | FieldsExtraError
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
