import type { Resource } from "@dpkit/core"
import {
  denormalizeResource,
  isTableResource,
  denormalizePath,
  isRemotePath,
  getBasename,
} from "@dpkit/core"

export type SaveFile = (props: {
  normalizedPath: string
  denormalizedPath: string
}) => Promise<void>

export async function saveResourceFile(props: {
  resource: Resource
  saveFile: SaveFile
  basepath?: string
  withRemote?: boolean
}) {
  const { resource, basepath, withRemote } = props
  const descriptor = denormalizeResource({ resource, basepath })

  const saveFile = async (path: string) => {
    const isRemote = isRemotePath({ path })

    const normalizedPath = path
    const denormalizedPath = isRemote
      ? getBasename({ path })
      : denormalizePath({ path, basepath })

    await props.saveFile({ normalizedPath, denormalizedPath })
    return denormalizedPath
  }

  if (typeof resource.path === "string") {
    descriptor.path = await saveFile(resource.path)
  }

  if (Array.isArray(resource.path)) {
    for (const [index, path] of resource.path.entries()) {
      descriptor.path[index] = await saveFile(path)
    }
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      const path = resource[name]
      if (typeof path === "string") {
        descriptor[name] = await saveFile(path)
      }
    }
  }

  return descriptor
}
