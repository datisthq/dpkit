import { loadDescriptor } from "../general/index.js"
import { assertPackage } from "./assert.js"

/**
 * Load a Package descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadPackageDescriptor(path: string) {
  const { basepath, descriptor } = await loadDescriptor(path)
  const dataPackage = await assertPackage(descriptor, { basepath })
  return dataPackage
}
