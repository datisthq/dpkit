import type { Package } from "@dpkit/core"

export async function savePackageToZip(props: {
  datapack: Package
  path: string
}) {
  console.log(props)
}
