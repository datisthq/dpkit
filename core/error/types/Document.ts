import type { BaseError } from "./Base.ts"

export type DocumentError = JsonDocumentError

export interface JsonDocumentError extends BaseError {
  type: "document/json"
  pointer: string
  message: string
}
