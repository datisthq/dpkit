import { getFormat, getName } from "@dpkit/metadata"
import type { ZenodoResource } from "../Resource.ts"

export function convertResourceFromZenodo(zenodoResource: ZenodoResource) {
  const path = convertPath(zenodoResource.links.self)

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

function convertPath(link: string) {
  return link.replace("/api/", "/").replace(/\/content$/, "")
}
