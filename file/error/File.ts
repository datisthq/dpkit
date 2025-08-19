import type { BytesError } from "./Bytes.ts"
import type { HashError } from "./Hash.ts"

export type FileError = BytesError | HashError
