import type { Descriptor } from "../descriptor/index.ts"
import { AssertException } from "../exception/index.ts"
import type { Schema } from "./Schema.ts"
import { validateSchema } from "./validate.ts"

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(source: Descriptor | Schema) {
  const report = await validateSchema(source)

  if (!report.schema) throw new AssertException(report.errors)
  return report.schema
}
