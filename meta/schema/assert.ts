import { AssertionError, type Descriptor } from "../descriptor/index.js"
import type { Schema } from "./Schema.js"
import { validateSchema } from "./validate.js"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(props: { descriptor: Descriptor }) {
  const { valid, errors } = await validateSchema(props)

  if (!valid) {
    throw new AssertionError(errors)
  }

  return props.descriptor as Schema
}
