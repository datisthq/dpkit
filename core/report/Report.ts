import type { DpkitError } from "../error/index.ts"

export interface Report<T extends DpkitError = DpkitError> {
  valid: boolean
  errors: T[]
}
