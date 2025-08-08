import type { Package } from "./Package.ts"
import { loadPackageDescriptor } from "./load.ts"

/**
 * Merges a system data package into a user data package if provided
 */
export async function mergePackages(options: {
  systemPackage: Package
  userPackagePath?: string
}) {
  const systemPackage = options.systemPackage

  const userPackage = options.userPackagePath
    ? await loadPackageDescriptor(options.userPackagePath)
    : undefined

  return { ...systemPackage, ...userPackage }
}
