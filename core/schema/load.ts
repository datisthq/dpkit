import { loadDescriptor } from "../general/index.js"
import type { Schema } from "./Schema.js"
import { assertSchema } from "./assert.js"

/**
 * Load a Schema descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadSchema<T extends Schema = Schema>(props: {
  path: string
}) {
  const { descriptor } = await loadDescriptor(props)
  const schema = await assertSchema<T>({ descriptor })
  return schema
}
