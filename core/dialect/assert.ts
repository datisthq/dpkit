import { AssertionError, type Descriptor } from "../general/index.js"
import type { Dialect } from "./Dialect.js"
import { validateDialect } from "./validate.js"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect<T extends Dialect = Dialect>(props: {
  descriptor: Descriptor
}) {
  const { dialect, errors } = await validateDialect<T>(props)
  if (!dialect) throw new AssertionError(errors)
  return dialect
}
