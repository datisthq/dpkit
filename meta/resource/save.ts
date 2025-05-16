import pMap from "p-map"
import {
  denormalizePath,
  getBasepath,
  saveDescriptor,
} from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { isTableResource } from "./types/table.js"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResourceDescriptor(props: {
  resource: Resource
  path: string
}) {
  const { resource, path } = props
  const basepath = await getBasepath({ path })

  await denormalizeResourcePaths({ resource, basepath })

  return saveDescriptor({
    descriptor: props.resource,
    path: props.path,
  })
}

export async function denormalizeResourcePaths(props: {
  resource: Resource
  basepath: string
}) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? await pMap(resource.path, path => denormalizePath({ path, basepath }))
      : await denormalizePath({ path: resource.path, basepath })
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      if (typeof resource[name] === "string") {
        resource[name] = await denormalizePath({
          path: resource[name],
          basepath,
        })
      }
    }
  }
}
