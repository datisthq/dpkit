import type { Schema } from "@dpkit/metadata"
import type { PolarsSchema } from "./Schema.ts"

export interface SchemaMapping {
  source: PolarsSchema
  target: Schema
}
