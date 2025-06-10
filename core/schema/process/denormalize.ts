import type { Descriptor } from "../../general/index.js"
import type { Schema } from "../Schema.js"

export function denormalizeSchema(schema: Schema) {
  schema = globalThis.structuredClone(schema)

  return schema as unknown as Descriptor
}
