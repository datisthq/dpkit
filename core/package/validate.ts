import { type Descriptor, validateDescriptor } from "../general/index.ts"
import { loadProfile } from "../general/index.ts"
import type { Package } from "./Package.ts"
import { normalizePackage } from "./normalize.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageDescriptor(
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
    dataPackage = normalizePackage(descriptor, {
      basepath: options?.basepath,
    }) as unknown as Package
  }

  return { valid, errors, dataPackage }
}
