import { loadDescriptor } from "../descriptor/index.js"
import { rewriteResourcePathsOnLoad } from "../resource/index.js"
import type { Package } from "./Package.js"
import { assertPackage } from "./assert.js"

/**
 * Load a Package descriptor (JSON Object) from a file or URL
 * Ensures the descriptor is valid against its profile
 */
export async function loadPackage(props: { path: string }) {
  const { basepath, descriptor } = await loadDescriptor(props)
  const datapack = await assertPackage({ descriptor })

  await rewritePackagePathsOnLoad({ package: datapack, basepath })

  return datapack
}

export async function rewritePackagePathsOnLoad(props: {
  package: Package
  basepath: string
}) {
  for (const resource of props.package.resources) {
    await rewriteResourcePathsOnLoad({ resource, basepath: props.basepath })
  }
}
