import type { ForeignKey } from "@dpkit/core"
import type { BaseError } from "./Base.ts"

export interface ForeignKeyError extends BaseError {
  type: "foreignKey"
  foreignKey: ForeignKey
  cells: string[]
}
