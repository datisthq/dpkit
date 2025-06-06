import { loadDescriptor } from "../general/index.js"
import { assertDialect } from "./assert.js"

/**
 * Load a Dialect descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadDialect(path: string) {
  const { descriptor } = await loadDescriptor(path)
  const dialect = await assertDialect(descriptor)
  return dialect
}
