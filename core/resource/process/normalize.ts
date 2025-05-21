import { normalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"

export function normalizeResource(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { basepath } = props
  const descriptor = globalThis.structuredClone(props.descriptor)

  normalizeUrl({ descriptor })
  normalizeType({ descriptor })
  normalizePaths({ descriptor, basepath })
  // TODO: normalizeDialect
  // TODO: normalizeSchema

  return descriptor
}

function normalizeUrl(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const url = descriptor.url
  if (!url) {
    return
  }

  if (!descriptor.path) {
    descriptor.path = descriptor.url
    descriptor.url = undefined
  }
}

function normalizeType(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  const type = descriptor.type
  if (!type) {
    return
  }

  if (typeof type !== "string") {
    descriptor.type = undefined
    console.warn(`Ignoring v2.0 incompatible resource type: ${type}`)
  }
}

function normalizePaths(props: { descriptor: Descriptor; basepath?: string }) {
  const { descriptor, basepath } = props

  if (typeof descriptor.path === "string") {
    descriptor.path = normalizePath({ path: descriptor.path, basepath })
  }

  if (Array.isArray(descriptor.path)) {
    for (const [index, path] of descriptor.path.entries()) {
      descriptor.path[index] = normalizePath({ path, basepath })
    }
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof descriptor[name] === "string") {
      descriptor[name] = normalizePath({
        path: descriptor[name],
        basepath,
      })
    }
  }
}
