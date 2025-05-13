import { saveMetadata } from "../metadata/save.js"
import type { Package } from "./Package.js"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackage(props: {
  package: Package
  path: string
}) {
  const { package: pkg, path } = props

  return saveMetadata({
    metadata: pkg,
    path,
  })
}
