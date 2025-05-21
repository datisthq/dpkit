import { denormalizePath } from "../../general/index.js"
import type { Descriptor } from "../../general/index.js"
import type { Resource } from "../Resource.js"
import { isTableResource } from "../types/table.js"

export function denormalizeResource(props: {
  resource: Resource
  basepath?: string
}) {
  const { basepath } = props
  const resource = globalThis.structuredClone(props.resource)

  denormalizePaths({ resource, basepath })
  // TODO: denormalizeDialect
  // TODO: denormalizeSchema

  return resource as Descriptor
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
