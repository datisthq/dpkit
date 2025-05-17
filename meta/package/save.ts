import { getBasepath, saveDescriptor } from "../descriptor/index.js"
import type { Package } from "./Package.js"
import { processPackageOnSave } from "./process/onSave.js"

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

  processPackageOnSave({ datapack: props.datapack, basepath })

  return saveDescriptor({
    descriptor: props.datapack,
    path: props.path,
  })
}
