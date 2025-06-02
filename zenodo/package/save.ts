import { blob } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/core"
import { denormalizePackage, stringifyDescriptor } from "@dpkit/core"
import {
  getPackageBasepath,
  readFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { makeZenodoApiRequest } from "../general/index.js"
import type { ZenodoPackage } from "./Package.js"
import { denormalizeZenodoPackage } from "./process/denormalize.js"

/**
 * Save a package to Zenodo
 * @param props Object containing the package to save and Zenodo API details
 * @returns Object with the deposit URL and DOI
 */
export async function savePackageToZenodo(props: {
  dataPackage: Package
  sandbox?: boolean
  apiKey: string
}) {
  const { dataPackage, apiKey, sandbox = false } = props
  const basepath = getPackageBasepath({ dataPackage })

  const newZenodoPackage = denormalizeZenodoPackage({ dataPackage })
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
      await saveResourceFiles({
        resource,
        basepath,
        withRemote: false,
        withoutFolders: true,
        saveFile: async props => {
          const upload = {
            name: props.denormalizedPath,
            data: await blob(
              await readFileStream({ path: props.normalizedPath }),
            ),
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

          return props.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage({ dataPackage, basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const upload = {
      name: denormalizedPath,
      data: new Blob([stringifyDescriptor({ descriptor })]),
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
