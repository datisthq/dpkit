import type { Descriptor } from "../descriptor/index.ts"
import { loadDescriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import type { Package } from "./Package.ts"
import { convertPackageFromDescriptor } from "./convert/fromDescriptor.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageMetadata(
  source: Package | Descriptor | string,
  options?: {
    basepath?: string
  },
) {
  const descriptor =
    typeof source === "string"
      ? await loadDescriptor(source)
      : (source as Descriptor)

  const profile =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const report = await validateDescriptor(descriptor, {
    profile,
  })

  let dataPackage: Package | undefined = undefined
  if (report.valid) {
    // Validation + normalization = we can cast it
    dataPackage = convertPackageFromDescriptor(descriptor, {
      basepath: options?.basepath,
    }) as unknown as Package
  }

  return { ...report, dataPackage }
}
