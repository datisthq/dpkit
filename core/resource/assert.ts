import { AssertionError, type Descriptor } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { validateResourceDescriptor } from "./validate.js"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(
  descriptorOrResource: Descriptor | Resource,
  options?: {
    basepath?: string
  },
) {
  const { errors, resource } = await validateResourceDescriptor(
    descriptorOrResource,
    options,
  )

  if (!resource) throw new AssertionError(errors)
  return resource
}
