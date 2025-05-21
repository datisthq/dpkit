import { getBasepath, saveDescriptor } from "../general/index.js"
import type { Package } from "./Package.js"
import { denormalizePackage } from "./process/denormalize.js"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(props: {
  datapack: Package
  path: string
}) {
  const { datapack, path } = props
  const basepath = getBasepath({ path })

  const descriptor = denormalizePackage({ datapack, basepath })
  await saveDescriptor({ descriptor, path: props.path })
}
