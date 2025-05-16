import { AssertionError, type Descriptor } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { validateResourceDescriptor } from "./validate.js"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(props: { descriptor: Descriptor }) {
  const { valid, errors } = await validateResourceDescriptor(props)

  if (!valid) {
    throw new AssertionError(errors)
  }

  return props.descriptor as Resource
}
