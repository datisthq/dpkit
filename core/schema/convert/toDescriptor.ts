import type { Descriptor } from "../../general/index.ts"
import type { Schema } from "../Schema.ts"

export function convertSchemaToDescriptor(schema: Schema) {
  schema = globalThis.structuredClone(schema)

  return schema as unknown as Descriptor
}
