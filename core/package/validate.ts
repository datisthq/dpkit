import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Package } from "./Package.js"
import { normalizePackage } from "./process/normalize.js"

/**
 * Validate a Package descriptor (JSON Object) against its profile
 */
export async function validatePackageDescriptor(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { descriptor, basepath } = props
  let datapackage: Package | undefined = undefined

  const $schema =
    typeof props.descriptor.$schema === "string"
      ? props.descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile({ path: $schema })
  const { valid, errors } = await validateDescriptor({ ...props, profile })

  if (valid) {
    // Validation + normalization = we can cast it
    datapackage = normalizePackage({
      descriptor,
      basepath,
    }) as unknown as Package
  }

  return { valid, errors, datapackage }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"
