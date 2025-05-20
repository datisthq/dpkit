import type { Package } from "@dpkit/meta"
//import { isRemotePath } from "@dpkit/meta"

export async function savePackageToFolder(props: {
  datapack: Package
  path: string
}) {
  console.log(props)
}

//function getBasepath(props: { datapack: Package }) {
//  const { datapack } = props
//  let basepath: string | undefined = undefined
//
//  for (const resource of datapack.resources) {
//    if (!resource.path) continue
//
//    const paths = Array.isArray(resource.path) ? resource.path : [resource.path]
//
//    for (const path of paths) {
//      if (isRemotePath({ path })) continue
//      if (!basepath) basepath = path
//    }
//  }
//}
