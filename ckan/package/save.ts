import { blob } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/core"
import { stringifyDescriptor } from "@dpkit/core"
import { denormalizePackage } from "@dpkit/core"
import {
  getPackageBasepath,
  readFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { makePostCkanApiRequest } from "../general/index.js"
import { denormalizeCkanPackage } from "./process/denormalize.js"

export async function savePackageToCkan(props: {
  datapackage: Package
  apiKey: string
  ckanUrl: string
  ownerOrg: string
  datasetName: string
}) {
  const { datapackage, ckanUrl, apiKey, datasetName, ownerOrg } = props

  const basepath = getPackageBasepath({ datapackage })
  const ckanPackage = denormalizeCkanPackage({ datapackage })

  const payload = {
    ...ckanPackage,
    name: datasetName,
    owner_org: ownerOrg,
    resources: [],
  }

  const response = await makePostCkanApiRequest({
    action: "package_create",
    payload,
    ckanUrl,
    apiKey,
  })

  if (!response.ok) {
    throw new Error(`Failed to save data package to CKAN: ${datasetName}`)
  }

  const data = (await response.json()) as Descriptor
  if (!data.success) {
    throw new Error(`Failed to save data package to CKAN: ${datasetName}`)
  }

  const url = new URL(ckanUrl)
  url.pathname = `/dataset/${data.result.name}`

  for (const resource of datapackage.resources) {
    await saveResourceFiles({
      resource,
      basepath,
      withRemote: true,
      saveFile: async props => {
        // TODO: add more metadata
        const formData = new FormData()
        formData.append("package_id", datasetName)
        formData.append("name", props.denormalizedPath)

        // TODO: rebase on streaming interface
        // https://github.com/nodejs/undici/issues/2202#issuecomment-1662008812
        const stream = await readFileStream({ path: props.normalizedPath })
        formData.append("upload", await blob(stream), props.denormalizedPath)

        await makePostCkanApiRequest({
          action: "resource_create",
          payload: formData,
          ckanUrl,
          apiKey,
        })
      },
    })
  }

  const descriptor = denormalizePackage({ datapackage, basepath })
  const file = new Blob([stringifyDescriptor({ descriptor })])

  // TODO: extract data+blob into makePostCkanApiRequest
  const formData = new FormData()
  formData.append("package_id", datasetName)
  formData.append("name", "datapackage.json")
  formData.append("upload", file, "datapackage.json")

  await makePostCkanApiRequest({
    action: "resource_create",
    payload: formData,
    ckanUrl,
    apiKey,
  })

  return {
    datasetId: data.result.id,
    datasetUrl: url.toString(),
  }
}
