import { getFilename, getFormat, getName } from "../general/index.ts"
import type { Resource } from "./Resource.ts"

export function inferResourceName(resource: Partial<Resource>) {
  let name = resource.name

  if (!name) {
    const path = Array.isArray(resource.path) ? resource.path[0] : resource.path
    if (path) {
      const filename = getFilename(path)
      name = getName(filename)
    } else {
      name = "resource"
    }
  }

  return name
}

export function inferResourceFormat(resource: Partial<Resource>) {
  let format = resource.format

  if (!format) {
    if (resource.path) {
      const path = Array.isArray(resource.path)
        ? resource.path[0]
        : resource.path
      if (path) {
        const filename = getFilename(path)
        format = getFormat(filename)
      }
    }
  }

  return format
}
