import type { Resource } from "@dpkit/core"
import type { CkanResource } from "../Resource.js"

/**
 * Normalizes a CKAN resource to Frictionless Data Resource format
 * @param props Object containing the CKAN resource to normalize
 * @returns Normalized Resource object
 */
export function normalizeCkanResource(props: {
  ckanResource: CkanResource
}): Resource {
  const { ckanResource } = props

  // Create the base ckanResource with required properties
  const resource: Resource = {
    // Use the ckanResource name, properly slugified
    name: slugifyName(ckanResource.name),

    // Map URL to path
    path: ckanResource.url,
  }

  // Conditionally add optional properties
  if (ckanResource.description) {
    resource.description = ckanResource.description
  }

  if (ckanResource.format) {
    // Format should be lowercase as per the reference
    resource.format = ckanResource.format.toLowerCase()
  }

  if (ckanResource.mimetype) {
    resource.mediatype = ckanResource.mimetype
  }

  if (ckanResource.size) {
    resource.bytes = ckanResource.size
  }

  if (ckanResource.hash) {
    resource.hash = ckanResource.hash
  }

  return resource
}

/**
 * Normalize a resource name by converting it to a valid identifier
 * Uses a simplified version of the slugify approach from the Python reference
 */
function slugifyName(name: string): string {
  return (
    name
      // Replace spaces, dots, etc. with underscores
      .replace(/[\s\.\(\)\/\\,]+/g, "_")
      // Convert to lowercase
      .toLowerCase()
      // Remove any characters that aren't alphanumeric, underscore, or hyphen
      .replace(/[^a-z0-9_\-]/g, "")
      // Ensure it starts with a letter or underscore (not a number)
      .replace(/^(\d)/, "_$1")
      // Trim to reasonable length
      .slice(0, 100)
  )
}
