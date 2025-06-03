import type { Descriptor } from "../../general/index.js"
import type { Field } from "../Field.js"

export function denormalizeField(props: { field: Field }) {
  const field = globalThis.structuredClone(props.field)
  return field as unknown as Descriptor
}
