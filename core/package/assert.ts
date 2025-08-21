import { AssertionError } from "../error/index.ts"
import type { Descriptor } from "../general/index.ts"
import type { Package } from "./Package.ts"
import { validatePackageDescriptor } from "./validate.ts"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(
  source: Descriptor | Package,
  options?: {
    basepath?: string
  },
) {
  const { errors, dataPackage } = await validatePackageDescriptor(
    source,
    options,
  )

  if (!dataPackage) throw new AssertionError(errors)
  return dataPackage
}
