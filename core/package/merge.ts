import type { Package } from "./Package.js"
import { loadPackageDescriptor } from "./load.js"

/**
 * Merges a system data package into a user data package if provided
 */
export async function mergePackages(props: {
  systemPackage: Package
  userPackagePath?: string
}) {
  const { systemPackage, userPackagePath } = props

  const userPackage = userPackagePath
    ? await loadPackageDescriptor({ path: userPackagePath })
    : undefined

  if (!userPackage) {
    return props.systemPackage
  }

  // NOTE:
  // Currently, it uses oversimplified logic till
  // we get use feedback on the desired merging strategies
  return { ...systemPackage, resources: userPackage.resources }
}
