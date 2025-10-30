import type { CellError } from "./Cell.ts"
import type { FieldError } from "./Field.ts"
import type { FieldsError } from "./Fields.ts"
import type { RowError } from "./Row.ts"

export type TableError = FieldsError | FieldError | RowError | CellError
