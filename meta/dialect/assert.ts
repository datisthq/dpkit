import { AssertionError, type Descriptor } from "../descriptor/index.js"
import type { Dialect } from "./Dialect.js"
import { validateDialect } from "./validate.js"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(props: { descriptor: Descriptor }) {
  const { valid, errors } = await validateDialect(props)

  if (!valid) {
    throw new AssertionError(errors)
  }

  return props.descriptor as Dialect
}
