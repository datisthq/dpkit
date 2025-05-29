import { AssertionError, type Descriptor } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { validateResourceDescriptor } from "./validate.js"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(props: {
  descriptor: Descriptor | Resource
  basepath?: string
}) {
  const { errors, resource } = await validateResourceDescriptor(props)
  if (!resource) throw new AssertionError(errors)
  return resource
}
