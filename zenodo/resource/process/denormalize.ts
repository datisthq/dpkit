import type { Resource } from "@dpkit/core"
import type { ZenodoResource } from "../Resource.js"

/**
 * Denormalizes a Frictionless Data resource to Zenodo file format
 * This function is primarily for mapping internal representation,
 * as actual file uploads are handled separately in the API
 * @param props Object containing the Resource to denormalize
 * @returns Partial Zenodo File object with available information
 */
export function denormalizeZenodoResource(props: {
  resource: Resource
}): Partial<ZenodoResource> | undefined {
  const { resource } = props

  if (!resource.path) {
    return undefined
  }

  let filename = "unknown"
  if (resource.name) {
    filename = resource.name
  } else if (typeof resource.path === "string") {
    const pathParts = resource.path.split("/")
    filename = pathParts[pathParts.length - 1] || "unknown"
  }

  const zenodoResource: Partial<ZenodoResource> = {
    filename,
  }

  if (resource.bytes) {
    zenodoResource.filesize = resource.bytes
  }

  if (resource.hash) {
    zenodoResource.checksum = resource.hash
  }

  return zenodoResource
}
