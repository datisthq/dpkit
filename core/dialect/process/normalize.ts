import type { Descriptor } from "../../general/index.js"

export function normalizeDialect(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  normalizeProfile(descriptor)
  normalizeTable(descriptor)

  return descriptor
}

function normalizeProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function normalizeTable(descriptor: Descriptor) {
  const table = descriptor.table
  if (!table) {
    return
  }

  if (typeof table !== "string") {
    descriptor.table = undefined
    console.warn(`Ignoring v2.0 incompatible dialect table: ${table}`)
  }
}
