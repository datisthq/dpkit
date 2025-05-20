import { loadPackage } from "@dpkit/core"
import { join } from "node:path"

export async function loadPackageFromFolder(props: { path: string }) {
  return loadPackage({ path: join(props.path, "datapackage.json") })
}
