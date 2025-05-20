import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import { loadProfile } from "../descriptor/index.js"
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
  let datapack: Package | undefined = undefined

  const $schema = descriptor.$schema ?? DEFAULT_PROFILE
  const profile = await loadProfile({ path: $schema })

  const { valid, errors } = await validateDescriptor({ ...props, profile })

  if (valid) {
    // Validation + normalization = we can cast it
    datapack = normalizePackage({ descriptor, basepath }) as Package
  }

  return { valid, errors, datapack }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/datapackage.json"
