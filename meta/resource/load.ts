import pMap from "p-map"
import { joinBasepath, loadDescriptor } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { assertResource } from "./assert.js"
import { isTableResource } from "./types/table.js"

/**
 * Load a Resource descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadResource(props: { path: string }) {
  const { basepath, descriptor } = await loadDescriptor(props)
  const resource = await assertResource({ descriptor })

  await rewriteResourcePaths({ resource, basepath })

  return resource
}

async function rewriteResourcePaths(props: {
  resource: Resource
  basepath: string
}) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? await pMap(resource.path, path => joinBasepath({ path, basepath }))
      : await joinBasepath({ path: resource.path, basepath })
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      if (typeof resource[name] === "string") {
        resource[name] = await joinBasepath({
          path: resource[name],
          basepath,
        })
      }
    }
  }
}
