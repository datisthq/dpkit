import type { Descriptor } from "../../descriptor/index.ts"
import { convertDialectToDescriptor } from "../../dialect/index.ts"
import { denormalizePath } from "../../path/index.ts"
import { convertSchemaToDescriptor } from "../../schema/index.ts"
import type { Resource } from "../Resource.ts"

export function convertResourceToDescriptor(
  resource: Resource,
  options?: {
    basepath?: string
  },
) {
  resource = globalThis.structuredClone(resource)

  convertPaths(resource, options)

  const dialect = convertDialect(resource)
  const schema = convertSchema(resource)

  return { ...resource, dialect, schema } as Descriptor
}

function convertPaths(
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

function convertDialect(resource: Resource) {
  if (!resource.dialect || typeof resource.dialect === "string") {
    return resource.dialect
  }

  return convertDialectToDescriptor(resource.dialect)
}

function convertSchema(resource: Resource) {
  if (!resource.schema || typeof resource.schema === "string") {
    return resource.schema
  }

  return convertSchemaToDescriptor(resource.schema)
}
