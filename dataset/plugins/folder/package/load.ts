import { join } from "node:path"
import { loadPackageDescriptor } from "@dpkit/metadata"

export async function loadPackageFromFolder(folderPath: string) {
  return loadPackageDescriptor(join(folderPath, "datapackage.json"))
}
