import type { CellRequiredError, CellTypeError } from "./Cell.js"
import type { FieldNameError, FieldTypeError } from "./Field.js"
import type { FieldsError } from "./Fields.js"

export type TableError =
  | FieldsError
  | FieldNameError
  | FieldTypeError
  | CellTypeError
  | CellRequiredError
