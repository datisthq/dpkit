import type { Schema } from "@dpkit/core"
import type { BaseTableError } from "./Base.js"

export interface FieldsError extends BaseTableError {
  type: "fields"
  category: "extra" | "missing"
  fieldNames: string[]
  fieldsMatch: Schema["fieldsMatch"]
}
