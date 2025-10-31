import type { Descriptor } from "../../descriptor/index.ts"
import type { Field } from "../Field.ts"

export function convertFieldToDescriptor(field: Field) {
  field = globalThis.structuredClone(field)

  return field as unknown as Descriptor
}
