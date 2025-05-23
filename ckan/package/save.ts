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
      withoutFolders: true,
      saveFile: async props => {
        const payload = {
          package_id: datasetName,
          name: props.denormalizedPath,
        }

        const upload = {
          name: props.denormalizedPath,
          data: await blob(
            await readFileStream({ path: props.normalizedPath }),
          ),
        }

        await makePostCkanApiRequest({
          action: "resource_create",
          payload,
          upload,
          ckanUrl,
          apiKey,
        })
      },
    })
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const payload = {
      package_id: datasetName,
      name: denormalizedPath,
    }

    const upload = {
      name: denormalizedPath,
      data: new Blob([
        stringifyDescriptor({
          descriptor: denormalizePackage({ datapackage, basepath }),
        }),
      ]),
    }

    await makePostCkanApiRequest({
      action: "resource_create",
      payload,
      upload,
      ckanUrl,
      apiKey,
    })
  }

  return {
    datasetId: data.result.id,
    datasetUrl: url.toString(),
  }
}
