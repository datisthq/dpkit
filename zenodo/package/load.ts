import { mergePackages } from "@dpkit/core"
import { makeZenodoApiRequest } from "../general/index.js"
import type { ZenodoPackage } from "./Package.js"
import type { Package } from "@dpkit/core"
import { normalizeZenodoPackage } from "./process/normalize.js"

/**
 * Load a package from a Zenodo deposit
 * @param props Object containing the URL to the Zenodo deposit
 * @returns Package object
 */
export async function loadPackageFromZenodo<
  T extends Package = Package,
>(props: {
  datasetUrl: string
  apiKey?: string
}) {
  const { datasetUrl, apiKey } = props
  const sandbox = new URL(props.datasetUrl).host === "sandbox.zenodo.org"

  const recordId = extractRecordId({ datasetUrl })
  if (!recordId) {
    throw new Error(`Failed to extract record ID from URL: ${datasetUrl}`)
  }

  const zenodoPackage = await makeZenodoApiRequest<ZenodoPackage>({
    endpoint: `/records/${recordId}`,
    apiKey,
    sandbox,
  })

  const systemPackage = normalizeZenodoPackage({ zenodoPackage })
  const userPackagePath = systemPackage.resources
    .filter(resource => resource["zenodo:key"] === "datapackage.json")
    .map(resource => resource["zenodo:url"])
    .at(0)

  const datapackage = await mergePackages<T>({ systemPackage, userPackagePath })
  datapackage.resources = datapackage.resources.map(resource => {
    // TODO: remove these keys completely
    return { ...resource, "zenodo:key": undefined, "zenodo:url": undefined }
  })

  return datapackage
}

/**
 * Extract deposit ID from URL
 *
 * Examples:
 * - https://zenodo.org/records/1234567
 * - https://sandbox.zenodo.org/records/1234567
 */
function extractRecordId(props: { datasetUrl: string }): string | undefined {
  const url = new URL(props.datasetUrl)
  const pathParts = url.pathname.split("/").filter(Boolean)
  return pathParts.at(-1)
}
