import type { Resource } from "@dpkit/core"
import type { ZenodoResource } from "../Resource.js"
import { getName, getFormat } from "@dpkit/core"

/**
 * Normalizes a Zenodo file to Frictionless Data resource format
 * @param props Object containing the Zenodo file to normalize
 * @returns Normalized Resource object
 */
export function normalizeZenodoResource(props: {
  zenodoResource: ZenodoResource
}): Resource {
  const { zenodoResource } = props

  const resource: Resource = {
    name: getName({ filename: zenodoResource.key }) ?? zenodoResource.id,
    path: zenodoResource.links.self,
    bytes: zenodoResource.size,
    hash: zenodoResource.checksum,
    format: getFormat({ filename: zenodoResource.key }),
  }

  return resource
}
