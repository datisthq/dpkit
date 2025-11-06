import type { BaseError } from "./Base.ts"

export interface EncodingError extends BaseError {
  type: "file/encoding"
  encoding: string
  actualEncoding: string
}
