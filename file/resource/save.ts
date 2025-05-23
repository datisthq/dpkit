import type { Resource } from "@dpkit/core"
import {
  denormalizePath,
  denormalizeResource,
  getFilename,
  isRemotePath,
  isTableResource,
} from "@dpkit/core"

export type SaveFile = (props: {
  propertyName: string
  propertyIndex: number
  normalizedPath: string
  denormalizedPath: string
}) => Promise<void>

export async function saveResourceFiles(props: {
  resource: Resource
  saveFile: SaveFile
  basepath?: string
  withRemote?: boolean
}) {
  const { resource, basepath, withRemote } = props
  const descriptor = denormalizeResource({ resource, basepath })

  const saveFile = async (path: string, name: string, index: number) => {
    const isRemote = isRemotePath({ path })

    const normalizedPath = path
    let denormalizedPath = denormalizePath({ path, basepath })

    if (isRemote) {
      if (!withRemote) return path
      const filename = getFilename({ path })
      if (!filename) return path
      denormalizedPath = filename
    }

    await props.saveFile({
      propertyName: name,
      propertyIndex: index,
      normalizedPath,
      denormalizedPath,
    })

    return denormalizedPath
  }

  if (typeof resource.path === "string") {
    descriptor.path = await saveFile(resource.path, "path", 0)
  }

  if (Array.isArray(resource.path)) {
    for (const [index, path] of resource.path.entries()) {
      descriptor.path[index] = await saveFile(path, "path", index)
    }
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      const path = resource[name]
      if (typeof path === "string") {
        descriptor[name] = await saveFile(path, name, 0)
      }
    }
  }

  return descriptor
}
