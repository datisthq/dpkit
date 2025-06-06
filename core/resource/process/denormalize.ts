import { denormalizeDialect } from "../../dialect/index.js"
import { denormalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"
import { denormalizeSchema } from "../../schema/index.js"
import type { Resource } from "../Resource.js"

export function denormalizeResource(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  resource = globalThis.structuredClone(resource)

  denormalizePaths(resource, options)

  const dialect = denormalizeResourceDialect(resource)
  const schema = denormalizeResourceSchema(resource)

  return { ...resource, dialect, schema } as Descriptor
}

function denormalizePaths(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  const basepath = options?.basepath

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? resource.path.map(path => denormalizePath(path, { basepath }))
      : denormalizePath(resource.path, { basepath })
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof resource[name] === "string") {
      resource[name] = denormalizePath(resource[name], { basepath })
    }
  }
}

function denormalizeResourceDialect(resource: Resource) {
  if (!resource.dialect || typeof resource.dialect === "string") {
    return resource.dialect
  }

  return denormalizeDialect(resource.dialect)
}

function denormalizeResourceSchema(resource: Resource) {
  if (!resource.schema || typeof resource.schema === "string") {
    return resource.schema
  }

  return denormalizeSchema(resource.schema)
}
