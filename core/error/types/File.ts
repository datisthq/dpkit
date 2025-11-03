import type { BytesError } from "./Bytes.ts"
import type { EncodingError } from "./Encoding.ts"
import type { HashError } from "./Hash.ts"

export type FileError = BytesError | HashError | EncodingError
