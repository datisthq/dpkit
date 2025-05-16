import { saveDescriptor } from "../descriptor/save.js"
import type { Package } from "./Package.js"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(props: {
  package: Package
  path: string
}) {
  return saveDescriptor({
    descriptor: props.package,
    path: props.path,
  })
}
