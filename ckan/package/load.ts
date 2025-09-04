import { mergePackages } from "@dpkit/core"
import { makeCkanApiRequest } from "../ckan/index.ts"
import type { CkanPackage } from "./Package.ts"
import { normalizeCkanPackage } from "./normalize.ts"

/**
 * Load a package from a CKAN instance
 * @param props Object containing the URL to the CKAN package
 * @returns Package object and cleanup function
 */
export async function loadPackageFromCkan(datasetUrl: string) {
  const packageId = extractPackageId(datasetUrl)
  if (!packageId) {
    throw new Error(`Failed to extract package ID from URL: ${datasetUrl}`)
  }

  const ckanPackage = await makeCkanApiRequest<CkanPackage>({
    ckanUrl: datasetUrl,
    action: "package_show",
    payload: { id: packageId },
  })

  for (const resource of ckanPackage.resources) {
    const resourceId = resource.id
    if (["CSV", "XLS", "XLSX"].includes(resource.format)) {
      const schema = await loadCkanSchema({ datasetUrl, resourceId })
      if (schema) {
        resource.schema = schema
      }
    }
  }

  const systemPackage = normalizeCkanPackage(ckanPackage)
  const userPackagePath = systemPackage.resources
    .filter(resource => resource["ckan:key"] === "datapackage.json")
    .map(resource => resource["ckan:url"])
    .at(0)

  const datapackage = await mergePackages({ systemPackage, userPackagePath })
  datapackage.resources = datapackage.resources.map(resource => {
    // TODO: remove these keys completely
    return { ...resource, "ckan:key": undefined, "ckan:url": undefined }
  })

  return datapackage
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
function extractPackageId(datasetUrl: string) {
  const url = new URL(datasetUrl)
  const pathParts = url.pathname.split("/").filter(Boolean)
  return pathParts.at(-1)
}

/**
 * Fetch resource schema data from CKAN datastore
 */
async function loadCkanSchema(options: {
  datasetUrl: string
  resourceId: string
}) {
  try {
    // For some reason, datastore_info doesn't work
    // So we use data fetching endpoint that also returns the schema
    const result = await makeCkanApiRequest({
      ckanUrl: options.datasetUrl,
      action: "datastore_search",
      payload: { resource_id: options.resourceId, limit: 0 },
    })

    // @ts-ignore
    const fields = result.fields.filter(
      (field: any) => field.id !== "_id" && field.id !== "_full_text",
    )

    return { fields }
  } catch (error) {
    return undefined
  }
}
