import { convertDialectFromDescriptor } from "../../dialect/index.ts"
import { isDescriptor, normalizePath } from "../../general/index.ts"
import type { Descriptor } from "../../general/index.ts"
import { isRemotePath } from "../../general/index.ts"
import { convertSchemaFromDescriptor } from "../../schema/index.ts"

export function convertResourceFromDescriptor(
  descriptor: Descriptor,
  options?: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)

  convertProfile(descriptor)
  convertUrl(descriptor)
  convertType(descriptor)
  convertPaths(descriptor, options)

  convertDialect(descriptor)
  convertSchema(descriptor)

  return descriptor
}

function convertProfile(descriptor: Descriptor) {
  const remoteProfile =
    typeof descriptor.profile === "string" && isRemotePath(descriptor.profile)
      ? descriptor.profile
      : undefined

  descriptor.$schema = descriptor.$schema ?? remoteProfile
}

function convertUrl(descriptor: Descriptor) {
  const url = descriptor.url
  if (!url) {
    return
  }

  if (!descriptor.path) {
    descriptor.path = descriptor.url
    descriptor.url = undefined
  }
}

function convertType(descriptor: Descriptor) {
  const type = descriptor.type
  if (!type) {
    return
  }

  if (typeof type !== "string") {
    descriptor.type = undefined
    console.warn(`Ignoring v2.0 incompatible resource type: ${type}`)
  }
}

function convertPaths(
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

function convertDialect(descriptor: Descriptor) {
  if (isDescriptor(descriptor.dialect)) {
    descriptor.dialect = convertDialectFromDescriptor(descriptor.dialect)
  }
}

function convertSchema(descriptor: Descriptor) {
  if (isDescriptor(descriptor.schema)) {
    descriptor.schema = convertSchemaFromDescriptor(descriptor.schema)
  }
}
