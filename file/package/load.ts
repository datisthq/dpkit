import { join } from "node:path"
import { loadPackageDescriptor } from "@dpkit/core"

export async function loadPackageFromFolder(folderPath: string) {
  return loadPackageDescriptor(join(folderPath, "datapackage.json"))
}
