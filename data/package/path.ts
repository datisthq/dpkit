import { resolve, relative, join, sep } from "node:path"
import type { Package } from "@dpkit/meta"
import { isRemotePath, getBasepath } from "@dpkit/meta"

export function getPackageBasepath(props: { datapack: Package }) {
  console.log(props)
}

export function getCommonLocalBasepath(props: { paths: string[] }) {
  const absoluteBasepaths = props.paths
    .filter(path => !isRemotePath({ path }))
    .map(path => resolve(getBasepath({ path })))

  // On Unix it split the root fs as an empty segment
  const segmentTable = absoluteBasepaths.map(path =>
    path.split(sep).map(segment => segment || "/"),
  )

  let column = 0
  const segments: string[] = []

  while (true) {
    const segmentColumn = segmentTable.map(segments => segments[column])
    const uniqueSegments = new Set(segmentColumn)

    if (uniqueSegments.size !== 1) break
    if (!segmentColumn[0]) break

    column++
    segments.push(segmentColumn[0])
  }

  const basepath = relative(process.cwd(), join(...segments))
  return basepath
}
