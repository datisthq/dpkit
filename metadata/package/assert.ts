import type { Descriptor } from "../descriptor/index.ts"
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
  const report = await validatePackageMetadata(source, options)

  if (!report.dataPackage) {
    throw new Error(
      `Package "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.dataPackage
}
