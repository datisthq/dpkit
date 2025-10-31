import type { Descriptor } from "../descriptor/index.ts"
import { AssertionError } from "../error/index.ts"
import type { Schema } from "./Schema.ts"
import { validateSchema } from "./validate.ts"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(source: Descriptor | Schema) {
  const { schema, errors } = await validateSchema(source)
  if (!schema) throw new AssertionError(errors)
  return schema
}
