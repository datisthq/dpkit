import type { Resource } from "@dpkit/core"
import type { ZenodoResource } from "../Resource.js"

export function denormalizeZenodoResource(props: { resource: Resource }) {
  const { resource } = props

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
