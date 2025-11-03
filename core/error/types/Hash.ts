import type { BaseError } from "./Base.ts"

export interface HashError extends BaseError {
  type: "file/hash"
  hash: string
  actualHash: string
}
