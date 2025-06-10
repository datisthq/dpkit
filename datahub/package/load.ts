import { loadPackageDescriptor } from "@dpkit/core"

export async function loadPackageFromDatahub(datasetUrl: string) {
  const url = new URL(datasetUrl)
  url.pathname = `${url.pathname}/datapackage.json`

  return loadPackageDescriptor(url.toString())
}
