import { denormalizeDialect } from "../../dialect/index.js"
import { denormalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"
import { denormalizeSchema } from "../../schema/index.js"
import type { Resource } from "../Resource.js"
import { isTableResource } from "../types/table.js"

export function denormalizeResource(props: {
  resource: Resource
  basepath?: string
}) {
  const { basepath } = props
  const resource = globalThis.structuredClone(props.resource)

  denormalizePaths({ resource, basepath })
  denormalizeDialectAndSchema({ resource })

  return resource as unknown as Descriptor
}

function denormalizePaths(props: { resource: Resource; basepath?: string }) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? resource.path.map(path => denormalizePath({ path, basepath }))
      : denormalizePath({ path: resource.path, basepath })
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      if (typeof resource[name] === "string") {
        resource[name] = denormalizePath({
          path: resource[name],
          basepath,
        })
      }
    }
  }
}

function denormalizeDialectAndSchema(props: { resource: Resource }) {
  const { resource } = props

  if (isTableResource(resource)) {
    if (resource.dialect && typeof resource.dialect !== "string") {
      resource.dialect = denormalizeDialect({ dialect: resource.dialect })
    }

    if (resource.schema && typeof resource.schema !== "string") {
      // TODO: review processing types Entity vs Descriptor
      // @ts-ignore
      resource.schema = denormalizeSchema({ schema: resource.schema })
    }
  }
}
