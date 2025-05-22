import { join } from "node:path"
import { loadPackage } from "@dpkit/core"

export async function loadPackageFromFolder(props: { folderPath: string }) {
  return loadPackage({ path: join(props.folderPath, "datapackage.json") })
}
