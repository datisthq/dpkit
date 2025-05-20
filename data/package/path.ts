import { resolve } from "node:path"
import type { Package } from "@dpkit/meta"
import { isRemotePath } from "@dpkit/meta"

export function getPackageBasepath(props: { datapack: Package }) {
  console.log(props)
}

export function getCommonLocalBasepath(props: { paths: string[] }) {
  const localPaths = props.paths
    .filter(path => !isRemotePath({ path }))
    .map(path => resolve(path))
}
