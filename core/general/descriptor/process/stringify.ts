import type { Descriptor } from "../Descriptor.js"

export function stringifyDescriptor(props: { descriptor: Descriptor }) {
  return JSON.stringify(props.descriptor, null, 2)
}
