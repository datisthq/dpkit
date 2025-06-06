import { AssertionError, type Descriptor } from "../general/index.js"
import type { Package } from "./Package.js"
import { validatePackageDescriptor } from "./validate.js"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(
  descriptorOrPackage: Descriptor | Package,
  options?: {
    basepath?: string
  },
) {
  const { errors, dataPackage } = await validatePackageDescriptor(
    descriptorOrPackage,
    options,
  )

  if (!dataPackage) throw new AssertionError(errors)
  return dataPackage
}
