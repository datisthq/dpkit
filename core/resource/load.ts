import { loadDescriptor } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { assertResource } from "./assert.js"

/**
 * Load a Resource descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadResourceDescriptor<
  T extends Resource = Resource,
>(props: { path: string }) {
  const { descriptor, basepath } = await loadDescriptor(props)
  const resource = await assertResource<T>({ descriptor, basepath })
  return resource
}
