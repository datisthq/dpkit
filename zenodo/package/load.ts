import { makeZenodoApiRequest } from "../general/index.js"
import type { ZenodoPackage } from "./Package.js"
import { normalizeZenodoPackage } from "./process/normalize.js"

/**
 * Load a package from a Zenodo deposit
 * @param props Object containing the URL to the Zenodo deposit
 * @returns Package object
 */
export async function loadPackageFromZenodo(props: {
  datasetUrl: string
  sandbox?: boolean
  apiKey?: string
}) {
  const { datasetUrl, apiKey, sandbox } = props

  const recordId = extractRecordId({ datasetUrl })
  if (!recordId) {
    throw new Error(`Failed to extract record ID from URL: ${datasetUrl}`)
  }

  const zenodoPackage = await loadZenodoPackage({
    recordId,
    apiKey,
    sandbox,
  })

  const datapackage = normalizeZenodoPackage({ zenodoPackage })
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

/**
 * Fetch deposit data from Zenodo API
 */
async function loadZenodoPackage(props: {
  recordId: string
  apiKey?: string
  sandbox?: boolean
}): Promise<ZenodoPackage> {
  const { recordId, apiKey, sandbox } = props

  const endpoint = `/records/${recordId}`
  const result = await makeZenodoApiRequest({
    endpoint,
    apiKey,
    sandbox,
  })

  return result as ZenodoPackage
}
