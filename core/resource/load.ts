import { loadDescriptor } from "../descriptor/index.ts"
import { resolveBasepath } from "../path/index.ts"
import { assertResource } from "./assert.ts"

/**
 * Load a Resource descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadResourceDescriptor(path: string) {
  const basepath = await resolveBasepath(path)
  const descriptor = await loadDescriptor(path)
  const resource = await assertResource(descriptor, { basepath })
  return resource
}
