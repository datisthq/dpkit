import type { Descriptor } from "../descriptor/Descriptor.js"
import { validateDescriptor } from "../descriptor/validate.js"
import defaultProfile from "./profiles/dialect-1.0.json" with { type: "json" }

/**
 * Validate a Dialect descriptor (JSON Object) against its profile
 */
export async function validateDialect(props: { descriptor: Descriptor }) {
  const errors = await validateDescriptor({ ...props, defaultProfile })
  return errors
}
