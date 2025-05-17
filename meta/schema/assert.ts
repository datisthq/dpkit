import { AssertionError, type Descriptor } from "../descriptor/index.js"
import { validateSchema } from "./validate.js"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(props: { descriptor: Descriptor }) {
  const { schema, errors } = await validateSchema(props)
  if (!schema) throw new AssertionError(errors)
  return schema
}
