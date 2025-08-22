import { AssertionError } from "../error/index.ts"
import type { Descriptor } from "../general/index.ts"
import type { Dialect } from "./Dialect.ts"
import { validateDialect } from "./validate.ts"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(source: Descriptor | Dialect) {
  const { dialect, errors } = await validateDialect(source)
  if (!dialect) throw new AssertionError(errors)
  return dialect
}
