import { join } from "node:path"
import { loadPackageDescriptor } from "@dpkit/core"

export async function loadPackageFromFolder(props: { folderPath: string }) {
  return loadPackageDescriptor({
    path: join(props.folderPath, "datapackage.json"),
  })
}
