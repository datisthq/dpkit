import type { BaseFileError } from "./Base.ts"

export interface EncodingError extends BaseFileError {
  type: "file/encoding"
  encoding: string
  actualEncoding: string
}
