import type { ForeignKey } from "@dpkit/core"
import type { BaseTableError } from "./Base.ts"

export interface ForeignKeyError extends BaseTableError {
  type: "foreignKey"
  foreignKey: ForeignKey
  cells: string[]
}
