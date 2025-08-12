import { normalizeDialect } from "../../dialect/index.ts"
import { isDescriptor, normalizePath } from "../../general/index.ts"
import type { Descriptor } from "../../general/index.ts"
import { normalizeSchema } from "../../schema/index.ts"

export function normalizeResource(
  descriptor: Descriptor,
  options?: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)

  normalizeProfile(descriptor)
  normalizeUrl(descriptor)
  normalizeType(descriptor)
  normalizePaths(descriptor, options)

  normalizeResourceDialect(descriptor)
  normalizeResourceSchema(descriptor)

  return descriptor
}

function normalizeProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function normalizeUrl(descriptor: Descriptor) {
  const url = descriptor.url
  if (!url) {
    return
  }

  if (!descriptor.path) {
    descriptor.path = descriptor.url
    descriptor.url = undefined
  }
}

function normalizeType(descriptor: Descriptor) {
  const type = descriptor.type
  if (!type) {
    return
  }

  if (typeof type !== "string") {
    descriptor.type = undefined
    console.warn(`Ignoring v2.0 incompatible resource type: ${type}`)
  }
}

function normalizePaths(
  descriptor: Descriptor,
  options?: { basepath?: string },
) {
  const basepath = options?.basepath

  if (typeof descriptor.path === "string") {
    descriptor.path = normalizePath(descriptor.path, { basepath })
  }

  if (Array.isArray(descriptor.path)) {
    for (const [index, path] of descriptor.path.entries()) {
      descriptor.path[index] = normalizePath(path, { basepath })
    }
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof descriptor[name] === "string") {
      descriptor[name] = normalizePath(descriptor[name], {
        basepath,
      })
    }
  }
}

function normalizeResourceDialect(descriptor: Descriptor) {
  if (isDescriptor(descriptor.dialect)) {
    descriptor.dialect = normalizeDialect(descriptor.dialect)
  }
}

function normalizeResourceSchema(descriptor: Descriptor) {
  if (isDescriptor(descriptor.schema)) {
    descriptor.schema = normalizeSchema(descriptor.schema)
  }
}
