import type { Package } from "@dpkit/meta"

export async function savePackageToFolder(props: {
  datapack: Package
  path: string
}) {
  console.log(props)
}
