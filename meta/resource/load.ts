import { loadDescriptor } from "../descriptor/index.js"
import { assertResource } from "./assert.js"

/**
 * Load a Resource descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadResource(props: { path: string }) {
  const descriptor = await loadDescriptor(props)
  const resource = await assertResource({ descriptor })
  return resource
}
