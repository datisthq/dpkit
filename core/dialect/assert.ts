import { AssertionError, type Descriptor } from "../general/index.ts"
import type { Dialect } from "./Dialect.ts"
import { validateDialect } from "./validate.ts"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(descriptor: Descriptor | Dialect) {
  const { dialect, errors } = await validateDialect(descriptor)
  if (!dialect) throw new AssertionError(errors)
  return dialect
}
