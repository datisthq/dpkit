import { getFormat, getName } from "@dpkit/core"
import { normalizeFileLink } from "../../general/index.js"
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

  const resource = {
    name: getName({ filename: zenodoResource.key }) ?? zenodoResource.id,
    format: getFormat({ filename: zenodoResource.key }),
    path: normalizeFileLink({ link: zenodoResource.links.self }),
    bytes: zenodoResource.size,
    hash: zenodoResource.checksum,
    "dpkit:isUserPackage": zenodoResource.key === "datapackage.json",
  }

  return resource
}
