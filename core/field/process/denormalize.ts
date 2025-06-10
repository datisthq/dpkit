import type { Descriptor } from "../../general/index.js"
import type { Field } from "../Field.js"

export function denormalizeField(field: Field) {
  field = globalThis.structuredClone(field)

  return field as unknown as Descriptor
}
