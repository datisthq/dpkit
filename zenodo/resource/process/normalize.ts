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
  const path = normalizePath({ link: zenodoResource.links.self })

  const resource = {
    path,
    name: getName({ filename: zenodoResource.key }) ?? zenodoResource.id,
    format: getFormat({ filename: zenodoResource.key }),
    bytes: zenodoResource.size,
    hash: zenodoResource.checksum,
    "zenodo:key": zenodoResource.key,
    "zenodo:url": path,
  }

  return resource
}

function normalizePath(props: { link: string }) {
  return props.link.replace("/api/", "/").replace(/\/content$/, "")
}
