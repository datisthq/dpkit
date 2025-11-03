import type { DataError } from "./types/Data.ts"
import type { FileError } from "./types/File.ts"
import type { MetadataError } from "./types/Metadata.ts"
import type { TableError } from "./types/Table.ts"

export type DpkitError = MetadataError | DataError | FileError | TableError
