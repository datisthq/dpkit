import type { Descriptor } from "../Descriptor.ts"

export function stringifyDescriptor(descriptor: Descriptor) {
  return JSON.stringify(descriptor, null, 2)
}
