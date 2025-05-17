import { AssertionError, type Descriptor } from "../descriptor/index.js"
import { validateDialect } from "./validate.js"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(props: { descriptor: Descriptor }) {
  const { dialect, errors } = await validateDialect(props)
  if (!dialect) throw new AssertionError(errors)
  return dialect
}
