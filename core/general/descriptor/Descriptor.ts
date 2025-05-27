export type Descriptor = Record<string, unknown>

export function isDescriptor(value: unknown): value is Descriptor {
  return !!value && typeof value === "object" && !Array.isArray(value)
}
