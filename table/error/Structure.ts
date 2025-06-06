import type { Schema } from "@dpkit/core"
import type { BaseTableError } from "./Base.js"

export interface StructureError extends BaseTableError {
  type: "structure"
  category: "extra" | "missing"
  fieldNames: string[]
  fieldsMatch: Schema["fieldsMatch"]
}
