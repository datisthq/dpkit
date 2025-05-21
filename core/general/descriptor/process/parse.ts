import type { Descriptor } from "../Descriptor.js"

export function parseDescriptor(props: { text: string }) {
  const value = JSON.parse(props.text)

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid descriptor: ${props.text}`)
  }

  return value as Descriptor
}
