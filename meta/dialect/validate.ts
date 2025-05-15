import type { Descriptor } from "../descriptor/Descriptor.js"
import { validateDescriptor } from "../descriptor/validate.js"
import profile from "./profiles/dialect-1.0.json" with { type: "json" }

export async function validateDialect(props: {
  descriptor: Descriptor
  orThrow?: boolean
}) {
  const errors = await validateDescriptor({ ...props, profile })
  return errors
}
