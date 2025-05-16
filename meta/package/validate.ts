import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import defaultProfile from "./profiles/package-1.0.json" with { type: "json" }

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageDescriptor(props: {
  descriptor: Descriptor
}) {
  return await validateDescriptor({ ...props, defaultProfile })
}
