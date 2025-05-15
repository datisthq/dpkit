import { loadDescriptor } from "../descriptor/index.js"
import { assertDialect } from "./assert.js"

/**
 * Load a Dialect descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadDialect(props: { path: string }) {
  const descriptor = await loadDescriptor(props)
  const dialect = await assertDialect({ descriptor })
  return dialect
}
