import { AssertionError, type Descriptor } from "../descriptor/index.js"
import type { Package } from "./Package.js"
import { validatePackageDescriptor } from "./validate.js"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(props: { descriptor: Descriptor }) {
  const { valid, errors } = await validatePackageDescriptor(props)

  if (!valid) {
    throw new AssertionError(errors)
  }

  return props.descriptor as Package
}
