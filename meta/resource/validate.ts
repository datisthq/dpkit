import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import defaultProfile from "./profiles/resource-1.0.json" with { type: "json" }

/**
 * Validate a Resource descriptor (JSON Object) against its profile
 */
export async function validateResourceDescriptor(props: {
  descriptor: Descriptor
}) {
  return await validateDescriptor({ ...props, defaultProfile })
}
