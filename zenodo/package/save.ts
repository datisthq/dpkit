import { blob } from "node:stream/consumers"
import { loadFileStream, saveResourceFiles } from "@dpkit/file"
import { getPackageBasepath } from "@dpkit/file"
import type { Descriptor, Package } from "@dpkit/metadata"
import {
  convertPackageToDescriptor,
  stringifyDescriptor,
} from "@dpkit/metadata"
import { makeZenodoApiRequest } from "../zenodo/index.ts"
import type { ZenodoPackage } from "./Package.ts"
import { convertPackageToZenodo } from "./convert/toZenodo.ts"

/**
 * Save a package to Zenodo
 * @param options Object containing the package to save and Zenodo API details
 * @returns Object with the deposit URL and DOI
 */
export async function savePackageToZenodo(
  dataPackage: Package,
  options: {
    sandbox?: boolean
    apiKey: string
  },
) {
  const { apiKey, sandbox = false } = options
  const basepath = getPackageBasepath(dataPackage)

  const newZenodoPackage = convertPackageToZenodo(dataPackage)
  const zenodoPackage = (await makeZenodoApiRequest({
    payload: newZenodoPackage,
    endpoint: "/deposit/depositions",
    method: "POST",
    apiKey,
    sandbox,
  })) as ZenodoPackage

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    if (!resource.path) continue

    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote: false,
        withoutFolders: true,
        saveFile: async options => {
          const upload = {
            name: options.denormalizedPath,
            data: await blob(await loadFileStream(options.normalizedPath)),
          }

          // It seems that record and deposition files have different metadata
          // structure, e.g. size vs filesize etc
          await makeZenodoApiRequest({
            endpoint: `/deposit/depositions/${zenodoPackage.id}/files`,
            method: "POST",
            upload,
            apiKey,
            sandbox,
          })

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...convertPackageToDescriptor(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const upload = {
      name: denormalizedPath,
      data: new Blob([stringifyDescriptor(descriptor)]),
    }

    await makeZenodoApiRequest({
      endpoint: `/deposit/depositions/${zenodoPackage.id}/files`,
      method: "POST",
      upload,
      apiKey,
      sandbox,
    })
  }

  const url = new URL(zenodoPackage.links.html)
  return {
    path: `${url.origin}/records/${zenodoPackage.id}/files/datapackage.json`,
    datasetUrl: `${url.origin}/uploads/${zenodoPackage.id}`,
  }
}
