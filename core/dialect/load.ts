import { loadDescriptor } from "../general/index.js"
import { assertDialect } from "./assert.js"
import type { Dialect } from "./Dialect.js"

/**
 * Load a Dialect descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadDialect<T extends Dialect = Dialect>(props: {
  path: string
}) {
  const { descriptor } = await loadDescriptor(props)
  const dialect = await assertDialect<T>({ descriptor })
  return dialect
}
