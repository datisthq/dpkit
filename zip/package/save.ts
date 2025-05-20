import type { Package } from "@dpkit/meta"

export async function savePackageToZip(props: {
  datapack: Package
  path: string
}) {
  console.log(props)
}
