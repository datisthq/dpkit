import type { BaseFileError } from "./Base.ts"

export interface HashError extends BaseFileError {
  type: "file/hash"
  hash: string
  actualHahs: string
}
