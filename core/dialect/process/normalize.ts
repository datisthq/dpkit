import type { Descriptor } from "../../general/index.js"

export function normalizeDialect(props: { descriptor: Descriptor }) {
  const descriptor = globalThis.structuredClone(props.descriptor)

  normalizeProfile({ descriptor })
  normalizeTable({ descriptor })

  return descriptor
}

function normalizeProfile(props: { descriptor: Descriptor }) {
  const { descriptor } = props
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function normalizeTable(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const table = descriptor.table
  if (!table) {
    return
  }

  if (typeof table !== "string") {
    descriptor.table = undefined
    console.warn(`Ignoring v2.0 incompatible dialect table: ${table}`)
  }
}
