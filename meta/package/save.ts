import { getBasepath, saveDescriptor } from "../descriptor/index.js"
import { denormalizeResourcePaths } from "../resource/index.js"
import type { Package } from "./Package.js"

/**
 * Save a Package to a file path
 * Works in Node.js environments
 */
export async function savePackageDescriptor(props: {
  package: Package
  path: string
}) {
  const { path } = props
  const basepath = await getBasepath({ path })

  await denormalizePackagePaths({ package: props.package, basepath })

  return saveDescriptor({
    descriptor: props.package,
    path: props.path,
  })
}

export async function denormalizePackagePaths(props: {
  package: Package
  basepath: string
}) {
  for (const resource of props.package.resources) {
    await denormalizeResourcePaths({ resource, basepath: props.basepath })
  }
}
