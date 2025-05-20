import type { Schema } from "../Schema.js"

export function denormalizeSchema(props: { schema: Schema }) {
  const schema = globalThis.structuredClone(props.schema)
  return schema
}
