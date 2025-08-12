import { getFilename, getFormat } from "../general/index.ts"
import type { Resource } from "./Resource.ts"

export function inferFormat(resource: Partial<Resource>) {
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
