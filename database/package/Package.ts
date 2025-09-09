import type { DatabaseSchema } from "../schema/index.ts"

export interface DatabasePackage {
  tables: DatabaseSchema[]
}
