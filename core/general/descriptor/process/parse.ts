import type { Descriptor } from "../Descriptor.js"

export function parseDescriptor(text: string) {
  const value = JSON.parse(text)

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid descriptor: ${text}`)
  }

  return value as Descriptor
}
