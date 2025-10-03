import { blob } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/core"
import {
  convertPackageToDescriptor,
  getFilename,
  getFormat,
  stringifyDescriptor,
} from "@dpkit/core"
import {
  getPackageBasepath,
  loadFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { makeCkanApiRequest } from "../ckan/index.ts"
import type { CkanResource } from "../resource/index.ts"
import { convertResourceToCkan } from "../resource/index.ts"
import { convertPackageToCkan } from "./convert/toCkan.ts"

export async function savePackageToCkan(
  dataPackage: Package,
  options: {
    apiKey: string
    ckanUrl: string
    ownerOrg: string
    datasetName: string
  },
) {
  const { apiKey, ckanUrl, ownerOrg, datasetName } = options

  const basepath = getPackageBasepath(dataPackage)
  const ckanPackage = convertPackageToCkan(dataPackage)

  const payload = {
    ...ckanPackage,
    name: datasetName,
    owner_org: ownerOrg,
    resources: [],
  }

  const result = await makeCkanApiRequest({
    action: "package_create",
    payload,
    ckanUrl: ckanUrl,
    apiKey: apiKey,
  })

  const url = new URL(ckanUrl)
  url.pathname = `/dataset/${result.name}`

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote: true,
        withoutFolders: true,
        saveFile: async options => {
          const filename = getFilename(options.normalizedPath)
          const ckanResource = convertResourceToCkan(resource)

          const payload = {
            ...ckanResource,
            package_id: datasetName,
            name: options.denormalizedPath,
            format: getFormat(filename)?.toUpperCase(),
          }

          const upload = {
            name: options.denormalizedPath,
            data: await blob(await loadFileStream(options.normalizedPath)),
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
    ...convertPackageToDescriptor(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const payload = {
      package_id: datasetName,
      name: denormalizedPath,
    }

    const upload = {
      name: denormalizedPath,
      data: new Blob([stringifyDescriptor(descriptor)]),
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
