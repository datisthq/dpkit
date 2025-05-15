import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import defaultProfile from "./profiles/schema-1.0.json" with { type: "json" }

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateSchema(props: { descriptor: Descriptor }) {
  const errors = await validateDescriptor({ ...props, defaultProfile })
  return errors
}
