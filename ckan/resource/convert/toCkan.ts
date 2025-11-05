import type { Resource } from "@dpkit/metadata"
import type { CkanResource } from "../Resource.ts"

export function convertResourceToCkan(resource: Resource) {
  const ckanResource: Partial<CkanResource> = {}

  if (resource.description) {
    ckanResource.description = resource.description
  }

  if (resource.format) {
    ckanResource.format = resource.format.toUpperCase()
  }

  if (resource.mediatype) {
    ckanResource.mimetype = resource.mediatype
  }

  if (resource.bytes) {
    ckanResource.size = resource.bytes
  }

  if (resource.hash) {
    ckanResource.hash = resource.hash
  }

  return ckanResource
}
