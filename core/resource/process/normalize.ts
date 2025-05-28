import { normalizeDialect } from "../../dialect/index.js"
import { isDescriptor, normalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"
import { normalizeSchema } from "../../schema/index.js"

export function normalizeResource(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { basepath } = props
  const descriptor = globalThis.structuredClone(props.descriptor)

  normalizeProfile({ descriptor })
  normalizeUrl({ descriptor })
  normalizeType({ descriptor })
  normalizePaths({ descriptor, basepath })

  normalizeResourceDialect({ descriptor })
  normalizeResourceSchema({ descriptor })

  return descriptor
}

function normalizeProfile(props: { descriptor: Descriptor }) {
  const { descriptor } = props
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
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

function normalizeResourceDialect(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  if (isDescriptor(descriptor.dialect)) {
    descriptor.dialect = normalizeDialect({ descriptor: descriptor.dialect })
  }
}

function normalizeResourceSchema(props: { descriptor: Descriptor }) {
  const { descriptor } = props

  if (isDescriptor(descriptor.schema)) {
    descriptor.schema = normalizeSchema({ descriptor: descriptor.schema })
  }
}
