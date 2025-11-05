import type { BaseError } from "./Base.ts"

export interface BytesError extends BaseError {
  type: "file/bytes"
  bytes: number
  actualBytes: number
}
