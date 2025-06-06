import { AssertionError, validatePackageDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import type { CamtrapPackage } from "./Package.js"

const SUPPORTED_PROFILES = [
  "https://raw.githubusercontent.com/tdwg/camtrap-dp/1.0/camtrap-dp-profile.json",
  "https://raw.githubusercontent.com/tdwg/camtrap-dp/1.0.1/camtrap-dp-profile.json",
]

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertCamtrapPackage(
  descriptorOrPackage: Descriptor | Package,
) {
  const descriptor = descriptorOrPackage as Descriptor

  const isCamtrap =
    typeof descriptor.$schema === "string" &&
    SUPPORTED_PROFILES.includes(descriptor.$schema)

  if (!isCamtrap) {
    throw new Error(`Unsupported Camtrap profile "${descriptor.$schema}"`)
  }

  const { errors, dataPackage } = await validatePackageDescriptor(descriptor)

  if (!dataPackage) throw new AssertionError(errors)
  return dataPackage as CamtrapPackage
}
