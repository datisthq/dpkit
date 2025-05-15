import { loadDescriptor } from "../descriptor/index.js"
import { assertSchema } from "./assert.js"

/**
 * Load a Schema descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadSchema(props: { path: string }) {
  const descriptor = await loadDescriptor(props)
  const schema = await assertSchema({ descriptor })
  return schema
}
