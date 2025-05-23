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
}) => Promise<string>

export async function saveResourceFiles(props: {
  resource: Resource
  saveFile: SaveFile
  basepath?: string
  withRemote?: boolean
  withoutFolders?: boolean
}) {
  const { resource, basepath, withRemote, withoutFolders } = props

  const descriptor = denormalizeResource({ resource, basepath })
  const dedupIndexes = new Map<string, number>()

  const saveFile = async (path: string, name: string, index: number) => {
    const isRemote = isRemotePath({ path })

    // Denormalized path always uses "/" as the path separator
    let denormalizedPath = denormalizePath({ path, basepath })
    const normalizedPath = path

    if (isRemote) {
      if (!withRemote) return path
      const filename = getFilename({ path })
      if (!filename) return path
      denormalizedPath = filename
    } else if (withoutFolders) {
      denormalizedPath = denormalizedPath.replaceAll("/", "-")
    }

    const dedupIndex = dedupIndexes.get(denormalizedPath) ?? 0
    dedupIndexes.set(denormalizedPath, dedupIndex + 1)

    if (dedupIndex) {
      denormalizedPath = denormalizedPath.replace(
        /^(.*?)([^\/]+?)(\.[^\/]+(?:\.[^\/]+)*)$/,
        `$1$2-${dedupIndex}$3`,
      )
    }

    denormalizedPath = await props.saveFile({
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
