import {
  AssertionError,
  type Package,
  validatePackageDescriptor,
} from "@dpkit/core"
import type { CamtrapPackage } from "./Package.js"

const SUPPORTED_PROFILES = [
  "https://raw.githubusercontent.com/tdwg/camtrap-dp/1.0/camtrap-dp-profile.json",
  "https://raw.githubusercontent.com/tdwg/camtrap-dp/1.0.1/camtrap-dp-profile.json",
]

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertCamtrapPackage(props: {
  datapackage: Package
}) {
  if (!SUPPORTED_PROFILES.includes(props.datapackage.$schema ?? "")) {
    throw new Error(
      `Unsupported Camtrap DP profile: ${props.datapackage.$schema}`,
    )
  }

  const { errors, datapackage } = await validatePackageDescriptor({
    // @ts-ignore (TODO: figure out descriptor/package boundary here)
    descriptor: props.datapackage,
  })

  if (!datapackage) throw new AssertionError(errors)
  return datapackage as CamtrapPackage
}
