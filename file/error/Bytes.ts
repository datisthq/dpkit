import type { BaseFileError } from "./Base.ts"

export interface BytesError extends BaseFileError {
  type: "file/bytes"
  bytes: number
  actualBytes: number
}
