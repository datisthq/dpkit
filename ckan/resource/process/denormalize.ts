import type { Resource } from "@dpkit/core"
import { getFilename } from "@dpkit/core"
import type { CkanResource } from "../Resource.js"

/**
 * Denormalizes a Frictionless Data Resource to CKAN Resource format
 * @param props Object containing the Resource to denormalize
 * @returns Denormalized CKAN Resource object
 */
export function denormalizeCkanResource(props: {
  resource: Resource
}) {
  const { resource } = props

  const path = Array.isArray(resource.path) ? resource.path[0] : resource.path
  if (!path) {
    return undefined
  }

  const name = resource.title || getFilename({ path })
  if (!name) {
    return undefined
  }

  const ckanResource: Partial<CkanResource> = { name }

  if (resource.description) {
    ckanResource.description = resource.description
  }

  if (resource.format) {
    // CKAN format is traditionally uppercase
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
