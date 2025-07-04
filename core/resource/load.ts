import { loadDescriptor } from "../general/index.js"
import { assertResource } from "./assert.js"

/**
 * Load a Resource descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadResourceDescriptor(path: string) {
  const { descriptor, basepath } = await loadDescriptor(path)
  const resource = await assertResource(descriptor, { basepath })
  return resource
}
