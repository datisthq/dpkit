import { getFormat, getName } from "@dpkit/core"
import type { ZenodoResource } from "./Resource.ts"

/**
 * Normalizes a Zenodo file to Frictionless Data resource format
 * @param props Object containing the Zenodo file to normalize
 * @returns Normalized Resource object
 */
export function normalizeZenodoResource(zenodoResource: ZenodoResource) {
  const path = normalizeZenodoPath(zenodoResource.links.self)

  const resource = {
    path,
    name: getName(zenodoResource.key) ?? zenodoResource.id,
    format: getFormat(zenodoResource.key),
    bytes: zenodoResource.size,
    hash: zenodoResource.checksum,
    "zenodo:key": zenodoResource.key,
    "zenodo:url": path,
  }

  return resource
}

function normalizeZenodoPath(link: string) {
  return link.replace("/api/", "/").replace(/\/content$/, "")
}
