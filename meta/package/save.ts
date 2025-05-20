import { getBasepath, saveDescriptor } from "../descriptor/index.js"
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
  const { path } = props
  const basepath = getBasepath({ path })

  denormalizePackage({ datapack: props.datapack, basepath })
  await saveDescriptor({ descriptor: props.datapack, path: props.path })
}
