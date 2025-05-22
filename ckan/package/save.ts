import type { Package } from "@dpkit/core"

export async function savePackageToCkan(props: {
  datapackage: Package
}) {
  console.log(props)
}
