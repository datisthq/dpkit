import type { Schema } from "@dpkit/core"
import type { PolarsSchema } from "./Schema.ts"

export interface SchemaMapping {
  source: PolarsSchema
  target: Schema
}
