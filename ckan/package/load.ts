import type { Descriptor } from "@dpkit/core"
import { makeGetCkanApiRequest } from "../general/index.js"
import type { CkanPackage } from "./Package.js"
import { normalizeCkanPackage } from "./process/normalize.js"

/**
 * Load a package from a CKAN instance
 * @param props Object containing the URL to the CKAN package
 * @returns Package object and cleanup function
 */
export async function loadPackageFromCkan(props: { datasetUrl: string }) {
  const { datasetUrl } = props

  const ckanPackage = await loadCkanPackage({ datasetUrl })

  for (const resource of ckanPackage.resources) {
    const resourceId = resource.id
    if (["CSV", "XLS", "XLSX"].includes(resource.format)) {
      const schema = await loadCkanSchema({ datasetUrl, resourceId })
      if (schema) {
        resource.schema = schema
      }
    }
  }

  const datapackage = normalizeCkanPackage({ ckanPackage })
  return datapackage
}

/**
 * Fetch package data from CKAN API
 */
async function loadCkanPackage(props: { datasetUrl: string }) {
  const { datasetUrl } = props

  const packageId = extractPackageId({ datasetUrl })
  if (!packageId) {
    throw new Error(`Failed to extract package ID from URL: ${datasetUrl}`)
  }

  const response = await makeGetCkanApiRequest({
    ckanUrl: datasetUrl,
    action: "package_show",
    payload: { id: packageId },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ckan dataset: ${datasetUrl}`)
  }

  const data = (await response.json()) as Descriptor
  if (!data.success) {
    throw new Error(`Failed to fetch ckan dataset: ${datasetUrl}`)
  }

  return data.result as CkanPackage
}

/**
 * Extract package ID from URL
 *
 * Examples:
 * - https://hri.fi/data/en_GB/dataset/helsingin-kaupungin-verkkosivustojen-kavijaanalytiikka
 * - https://www.opendata.dk/city-of-copenhagen/parkeringszoner-information
 * - https://open.africa/dataset/pib-annual-senegal
 * - https://data.nhm.ac.uk/dataset/join-the-dots-collection-level-descriptions
 */
function extractPackageId(props: { datasetUrl: string }) {
  const url = new URL(props.datasetUrl)
  const pathParts = url.pathname.split("/").filter(Boolean)
  return pathParts.at(-1)
}

/**
 * Fetch resource schema data from CKAN datastore
 */
async function loadCkanSchema(props: {
  datasetUrl: string
  resourceId: string
}) {
  const { datasetUrl, resourceId } = props

  // For some readon, datastore_info doesn't work
  // So we use data fetching endpoint that also returns the schema
  const response = await makeGetCkanApiRequest({
    ckanUrl: datasetUrl,
    action: "datastore_search",
    payload: { resource_id: resourceId, limit: 0 },
  })

  if (!response.ok) {
    return undefined
  }

  const data = (await response.json()) as Descriptor
  if (!data.success || !data.result || !data.result.fields) {
    return undefined
  }

  const fields = data.result.fields.filter(
    (field: any) => field.id !== "_id" && field.id !== "_full_text",
  )

  return { fields }
}
