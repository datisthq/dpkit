import { AssertionError, type Descriptor } from "../general/index.ts"
import type { Resource } from "./Resource.ts"
import { validateResourceDescriptor } from "./validate.ts"

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
