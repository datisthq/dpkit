import { type Descriptor, assertDescriptor } from "../descriptor/index.js"
import type { Package } from "./Package.js"
import defaultProfile from "./profiles/package-1.0.json" with { type: "json" }

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(props: { descriptor: Descriptor }) {
  const pkg = await assertDescriptor<Package>({
    ...props,
    defaultProfile,
  })
  return pkg
}
