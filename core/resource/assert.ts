import type { Descriptor } from "../descriptor/index.ts"
import { AssertionError } from "../error/index.ts"
import type { Resource } from "./Resource.ts"
import { validateResourceMetadata } from "./validate.ts"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(
  source: Descriptor | Resource,
  options?: {
    basepath?: string
  },
) {
  const { errors, resource } = await validateResourceMetadata(source, options)

  if (!resource) throw new AssertionError(errors)
  return resource
}
