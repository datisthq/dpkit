import type { Resource } from "@dpkit/core"
import { denormalizeResource, isRemotePath, isTableResource } from "@dpkit/core"
import type { saveFile } from "../general/index.js"

export async function saveResourceFile(props: {
  resource: Resource
  folder: string
  basepath?: string
  withRemote?: boolean
  saveFile: typeof saveFile
}) {
  const { resource, basepath, folder, withRemote } = props
  const descriptor = denormalizeResource({ resource, basepath })

  // There are pros and cons of doing it in parallel (introduce flag?)
  if (resource.path) {
    const paths = Array.isArray(resource.path) ? resource.path : [resource.path]

    for (const path of paths) {
      const isRemote = isRemotePath({ path })
      files.push({ path, isRemote })
    }
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      const path = resource[name]
      if (typeof path === "string") {
        const isRemote = isRemotePath({ path })
        files.push({ path, isRemote })
      }
    }
  }

  return descriptor
}
