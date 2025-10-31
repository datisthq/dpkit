import type { Descriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { loadProfile } from "../profile/index.ts"
import type { Package } from "./Package.ts"
import { convertPackageFromDescriptor } from "./convert/fromDescriptor.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageMetadata(
  source: Descriptor | Package,
  options?: {
    basepath?: string
  },
) {
  const descriptor = source as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile($schema)
  const { valid, errors } = await validateDescriptor(descriptor, { profile })

  let dataPackage: Package | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    dataPackage = convertPackageFromDescriptor(descriptor, {
      basepath: options?.basepath,
    }) as unknown as Package
  }

  return { valid, errors, dataPackage }
}
