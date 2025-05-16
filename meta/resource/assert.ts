import { type Descriptor, assertDescriptor } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import defaultProfile from "./profiles/resource-1.0.json" with { type: "json" }

/**
 * Assert a Resource descriptor (JSON Object) against its profile
 */
export async function assertResource(props: { descriptor: Descriptor }) {
  const resource = await assertDescriptor<Resource>({
    ...props,
    defaultProfile,
  })
  return resource
}
