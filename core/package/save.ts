import { getBasepath, saveDescriptor } from "../general/index.js"
import type { Package } from "./Package.js"
import { denormalizePackage } from "./process/denormalize.js"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(props: {
  datapackage: Package
  path: string
}) {
  const { datapackage, path } = props
  const basepath = getBasepath({ path })

  const descriptor = denormalizePackage({ datapackage, basepath })
  await saveDescriptor({ descriptor, path: props.path })
}
