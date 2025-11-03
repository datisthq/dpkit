import type { Descriptor } from "../descriptor/index.ts"
import { AssertException } from "../exception/index.ts"
import type { Dialect } from "./Dialect.ts"
import { validateDialect } from "./validate.ts"

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(source: Descriptor | Dialect) {
  const report = await validateDialect(source)

  if (!report.dialect) throw new AssertException(report.errors)
  return report.dialect
}
