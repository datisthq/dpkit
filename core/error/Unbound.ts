import type { DataError } from "./types/Data.ts"
import type { DocumentError } from "./types/Document.ts"
import type { FileError } from "./types/File.ts"
import type { MetadataError } from "./types/Metadata.ts"
import type { TableError } from "./types/Table.ts"

export type UnboundError =
  | MetadataError
  | DataError
  | FileError
  | TableError
  | DocumentError
