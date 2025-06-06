import { AssertionError, type Descriptor } from "../general/index.js"
import type { Schema } from "./Schema.js"
import { validateSchema } from "./validate.js"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(descriptor: Descriptor | Schema) {
  const { schema, errors } = await validateSchema(descriptor)
  if (!schema) throw new AssertionError(errors)
  return schema
}
