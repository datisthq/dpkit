import type { Package } from "./Package.js"
import { loadPackageDescriptor } from "./load.js"

/**
 * Merges a system data package into a user data package if provided
 */
export async function mergePackages(props: {
  systemPackage: Package
  userPackagePath?: string
}) {
  const systemPackage = props.systemPackage
  const userPackage = props.userPackagePath
    ? await loadPackageDescriptor({ path: props.userPackagePath })
    : undefined

  return { ...systemPackage, ...userPackage }
}
