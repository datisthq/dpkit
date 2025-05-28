import { AssertionError, type Descriptor } from "../general/index.js"
import { validateSchema } from "./validate.js"
import type { Schema } from "./Schema.js"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema<T extends Schema = Schema>(props: {
  descriptor: Descriptor
}) {
  const { schema, errors } = await validateSchema<T>(props)
  if (!schema) throw new AssertionError(errors)
  return schema
}
