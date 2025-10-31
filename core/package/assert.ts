import type { Descriptor } from "../descriptor/index.ts"
import { AssertionError } from "../error/index.ts"
import type { Package } from "./Package.ts"
import { validatePackageMetadata } from "./validate.ts"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(
  source: Descriptor | Package,
  options?: {
    basepath?: string
  },
) {
  const { errors, dataPackage } = await validatePackageMetadata(source, options)

  if (!dataPackage) throw new AssertionError(errors)
  return dataPackage
}
