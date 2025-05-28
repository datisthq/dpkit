import { join } from "node:path"
import type { Package } from "@dpkit/core"
import { loadPackageDescriptor } from "@dpkit/core"

export async function loadPackageFromFolder<
  T extends Package = Package,
>(props: { folderPath: string }) {
  return loadPackageDescriptor<T>({
    path: join(props.folderPath, "datapackage.json"),
  })
}
