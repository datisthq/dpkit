import type { Descriptor } from "../Descriptor.js"

export function stringifyDescriptor(descriptor: Descriptor) {
  return JSON.stringify(descriptor, null, 2)
}
