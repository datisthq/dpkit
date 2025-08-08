import type { Descriptor } from "../../general/index.ts"
import type { Field } from "../Field.ts"

export function denormalizeField(field: Field) {
  field = globalThis.structuredClone(field)

  return field as unknown as Descriptor
}
