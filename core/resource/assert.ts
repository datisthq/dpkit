import { AssertionError, type Descriptor } from "../general/index.js"
import { validateResourceDescriptor } from "./validate.js"
import type { Resource } from "./Resource.js"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource<T extends Resource = Resource>(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { errors, resource } = await validateResourceDescriptor<T>(props)
  if (!resource) throw new AssertionError(errors)
  return resource
}
