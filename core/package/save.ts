import { getBasepath, saveDescriptor } from "../general/index.ts"
import type { Package } from "./Package.ts"
import { convertPackageToDescriptor } from "./convert/toDescriptor.ts"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/datapackage.json"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(
  dataPackage: Package,
  options: {
    path: string
  },
) {
  const basepath = getBasepath(options.path)

  const descriptor = convertPackageToDescriptor(dataPackage, { basepath })
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, { path: options.path })
}
