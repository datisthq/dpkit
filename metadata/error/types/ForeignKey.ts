import type { ForeignKey } from "../../schema/index.ts"
import type { BaseError } from "./Base.ts"

export interface ForeignKeyError extends BaseError {
  type: "foreignKey"
  foreignKey: ForeignKey
  cells: string[]
}
