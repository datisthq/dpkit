import { getBasepath, saveDescriptor } from "../general/index.js"
import type { Package } from "./Package.js"
import { denormalizePackage } from "./process/denormalize.js"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/datapackage.json"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(props: {
  dataPackage: Package
  path: string
}) {
  const { dataPackage, path } = props
  const basepath = getBasepath({ path })

  const descriptor = denormalizePackage({ dataPackage, basepath })
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor({ descriptor, path: props.path })
}
