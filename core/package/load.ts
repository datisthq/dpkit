import { loadDescriptor } from "../general/index.js"
import { assertPackage } from "./assert.js"

/**
 * Load a Package descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadPackageDescriptor(props: { path: string }) {
  const { basepath, descriptor } = await loadDescriptor(props)
  const datapackage = await assertPackage({ descriptor, basepath })
  return datapackage
}
