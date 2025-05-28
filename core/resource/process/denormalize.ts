import { denormalizeDialect } from "../../dialect/index.js"
import { denormalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"
import { denormalizeSchema } from "../../schema/index.js"
import type { Resource } from "../Resource.js"

export function denormalizeResource(props: {
  resource: Resource
  basepath?: string
}) {
  const { basepath } = props
  const resource = globalThis.structuredClone(props.resource)

  denormalizePaths({ resource, basepath })

  const dialect = denormalizeResourceDialect({ resource })
  const schema = denormalizeResourceSchema({ resource })

  return { ...resource, dialect, schema } as Descriptor
}

function denormalizePaths(props: { resource: Resource; basepath?: string }) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? resource.path.map(path => denormalizePath({ path, basepath }))
      : denormalizePath({ path: resource.path, basepath })
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof resource[name] === "string") {
      resource[name] = denormalizePath({
        path: resource[name],
        basepath,
      })
    }
  }
}

function denormalizeResourceDialect(props: { resource: Resource }) {
  const { resource } = props

  if (!resource.dialect || typeof resource.dialect === "string") {
    return resource.dialect
  }

  return denormalizeDialect({ dialect: resource.dialect })
}

function denormalizeResourceSchema(props: { resource: Resource }) {
  const { resource } = props

  if (!resource.schema || typeof resource.schema === "string") {
    return resource.schema
  }

  return denormalizeSchema({ schema: resource.schema })
}
