import type { Resource } from "@dpkit/core"
import { getFormat, getName } from "@dpkit/core"
import type { ZenodoResource } from "../Resource.js"

/**
 * Normalizes a Zenodo file to Frictionless Data resource format
 * @param props Object containing the Zenodo file to normalize
 * @returns Normalized Resource object
 */
export function normalizeZenodoResource(props: {
  zenodoResource: ZenodoResource
}) {
  const { zenodoResource } = props

  const resource: Resource = {
    name: getName({ filename: zenodoResource.key }) ?? zenodoResource.id,
    format: getFormat({ filename: zenodoResource.key }),
    path: zenodoResource.links.self
      .replace("/api/", "/")
      .replace(/\/content$/, ""),
    bytes: zenodoResource.size,
    hash: zenodoResource.checksum,
  }

  return resource
}
