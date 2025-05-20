import { join } from "node:path"
import { loadPackage } from "@dpkit/core"

export async function loadPackageFromFolder(props: { path: string }) {
  return loadPackage({ path: join(props.path, "datapackage.json") })
}
