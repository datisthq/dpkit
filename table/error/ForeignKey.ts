import type { ForeignKey } from "@dpkit/core"
import type { BaseTableError } from "./Base.ts"

export interface ForeignKeyError extends BaseTableError {
  foreignKey: ForeignKey
  cells: string[]
}
