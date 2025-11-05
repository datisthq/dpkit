import type { ForeignKey } from "@dpkit/metadata"
import type { BaseError } from "./Base.ts"

export interface ForeignKeyError extends BaseError {
  type: "foreignKey"
  foreignKey: ForeignKey
  cells: string[]
}
