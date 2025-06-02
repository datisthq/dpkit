import { join, relative, resolve, sep } from "node:path"
import { type Package, getBasepath, isRemotePath } from "@dpkit/core"

export function getPackageBasepath(props: { dataPackage: Package }) {
  const paths: string[] = []

  for (const resource of props.dataPackage.resources) {
    if (!resource.path) {
      continue
    }

    const resourcePaths = Array.isArray(resource.path)
      ? resource.path
      : [resource.path]

    paths.push(...resourcePaths)
  }

  return getCommonLocalBasepath({ paths })
}

export function getCommonLocalBasepath(props: { paths: string[] }) {
  const absoluteBasepaths = props.paths
    .filter(path => !isRemotePath({ path }))
    .map(path => resolve(getBasepath({ path })))

  if (!absoluteBasepaths.length) {
    return undefined
  }

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

  if (!segments.length) {
    throw new Error("Cannot find common basepath")
  }

  const basepath = relative(process.cwd(), join(...segments))
  return basepath
}
