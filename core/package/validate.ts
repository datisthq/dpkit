import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Package } from "./Package.js"
import { normalizePackage } from "./process/normalize.js"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageDescriptor(props: {
  descriptor: Descriptor | Package
  basepath?: string
}) {
  const { basepath } = props
  const descriptor = props.descriptor as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile({ path: $schema })
  const { valid, errors } = await validateDescriptor({ descriptor, profile })

  let dataPackage: Package | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    dataPackage = normalizePackage({
      descriptor,
      basepath,
    }) as unknown as Package
  }

  return { valid, errors, dataPackage }
}
