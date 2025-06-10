import { loadPackageDescriptor } from "@dpkit/core"

export async function loadPackageFromDatahub(datasetUrl: string) {
  const url = new URL(datasetUrl)

  url.pathname = `${url.pathname}/datapackage.json`
  url.search = ""
  url.hash = ""

  return loadPackageDescriptor(url.toString())
}
