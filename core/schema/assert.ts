import { AssertionError, type Descriptor } from "../general/index.ts"
import type { Schema } from "./Schema.ts"
import { validateSchema } from "./validate.ts"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(descriptor: Descriptor | Schema) {
  const { schema, errors } = await validateSchema(descriptor)
  if (!schema) throw new AssertionError(errors)
  return schema
}
