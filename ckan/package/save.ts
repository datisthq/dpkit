import { blob } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/core"
import {
  denormalizePackage,
  getFilename,
  getFormat,
  stringifyDescriptor,
} from "@dpkit/core"
import {
  getPackageBasepath,
  readFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { makeCkanApiRequest } from "../general/index.js"
import type { CkanResource } from "../resource/index.js"
import { denormalizeCkanResource } from "../resource/index.js"
import { denormalizeCkanPackage } from "./process/denormalize.js"

export async function savePackageToCkan(props: {
  dataPackage: Package
  apiKey: string
  ckanUrl: string
  ownerOrg: string
  datasetName: string
}) {
  const { dataPackage, ckanUrl, apiKey, datasetName, ownerOrg } = props

  const basepath = getPackageBasepath({ dataPackage })
  const ckanPackage = denormalizeCkanPackage({ dataPackage })

  const payload = {
    ...ckanPackage,
    name: datasetName,
    owner_org: ownerOrg,
    resources: [],
  }

  const result = await makeCkanApiRequest({
    action: "package_create",
    payload,
    ckanUrl,
    apiKey,
  })

  const url = new URL(ckanUrl)
  url.pathname = `/dataset/${result.name}`

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles({
        resource,
        basepath,
        withRemote: true,
        withoutFolders: true,
        saveFile: async props => {
          const filename = getFilename({ path: props.normalizedPath })
          const ckanResource = denormalizeCkanResource({ resource })

          const payload = {
            ...ckanResource,
            package_id: datasetName,
            name: props.denormalizedPath,
            format: getFormat({ filename })?.toUpperCase(),
          }

          const upload = {
            name: props.denormalizedPath,
            data: await blob(
              await readFileStream({ path: props.normalizedPath }),
            ),
          }

          const result = await makeCkanApiRequest<CkanResource>({
            action: "resource_create",
            payload,
            upload,
            ckanUrl,
            apiKey,
          })

          return result.url
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage({ dataPackage, basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const payload = {
      package_id: datasetName,
      name: denormalizedPath,
    }

    const upload = {
      name: denormalizedPath,
      data: new Blob([stringifyDescriptor({ descriptor })]),
    }

    await makeCkanApiRequest({
      action: "resource_create",
      payload,
      upload,
      ckanUrl,
      apiKey,
    })
  }

  return {
    path: result.url,
    datasetUrl: url.toString(),
  }
}
