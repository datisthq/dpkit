import type { Resource } from "@dpkit/metadata"
import type { ZenodoResource } from "../Resource.ts"

export function convertResourceToZenodo(resource: Resource) {
  const zenodoResource: Partial<ZenodoResource> = {
    key: resource.name,
  }

  if (resource.bytes) {
    zenodoResource.size = resource.bytes
  }

  if (resource.hash) {
    zenodoResource.checksum = resource.hash
  }

  return zenodoResource
}
