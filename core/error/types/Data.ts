import type { BaseError } from "./Base.ts"

export interface DataError extends BaseError {
  type: "data"
  message: string
}
