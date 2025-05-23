import type { Resource } from "@dpkit/core"
import type { ZenodoFile } from "../File.js"

/**
 * Normalizes a Zenodo file to Frictionless Data resource format
 * @param props Object containing the Zenodo file to normalize
 * @returns Normalized Resource object
 */
export function normalizeZenodoFile(props: {
  zenodoFile: ZenodoFile
}): Resource {
  const { zenodoFile } = props

  const resource: Resource = {
    name: zenodoFile.filename,
    path: zenodoFile.links.download,
    bytes: zenodoFile.filesize,
    hash: zenodoFile.checksum,
  }

  // Extract file format from filename
  const fileExtension = zenodoFile.filename.split(".").pop()?.toUpperCase()
  if (fileExtension) {
    resource.format = fileExtension
  }

  return resource
}
