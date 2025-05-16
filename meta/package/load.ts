import { loadDescriptor } from "../descriptor/index.js"
import { assertPackage } from "./assert.js"

/**
 * Load a Package descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadPackage(props: { path: string }) {
  const { descriptor } = await loadDescriptor(props)
  const dpackage = await assertPackage({ descriptor })
  return dpackage
}
