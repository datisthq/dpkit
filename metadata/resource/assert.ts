import type { Descriptor } from "../descriptor/index.ts"
import type { Resource } from "./Resource.ts"
import { validateResourceMetadata } from "./validate.ts"

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(
  source: Descriptor | Resource,
  options?: {
    basepath?: string
  },
) {
  const report = await validateResourceMetadata(source, options)

  if (!report.resource) {
    throw new Error(
      `Resource "${JSON.stringify(source).slice(0, 100)}" is not valid`,
    )
  }

  return report.resource
}
