import type { Descriptor } from "../../general/index.ts"

export function convertDialectFromDescriptor(descriptor: Descriptor) {
  descriptor = globalThis.structuredClone(descriptor)

  convertProfile(descriptor)
  convertTable(descriptor)

  return descriptor
}

function convertProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function convertTable(descriptor: Descriptor) {
  const table = descriptor.table
  if (!table) {
    return
  }

  if (typeof table !== "string") {
    descriptor.table = undefined
    console.warn(`Ignoring v2.0 incompatible dialect table: ${table}`)
  }
}
