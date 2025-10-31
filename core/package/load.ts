import { loadDescriptor } from "../general/index.ts"
import { resolveBasepath } from "../general/index.ts"
import { assertPackage } from "./assert.ts"

/**
 * Load a Package descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadPackageDescriptor(path: string) {
  const basepath = await resolveBasepath(path)
  const descriptor = await loadDescriptor(path)
  const dataPackage = await assertPackage(descriptor, { basepath })
  return dataPackage
}
