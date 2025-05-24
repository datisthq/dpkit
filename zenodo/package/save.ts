import { blob } from "node:stream/consumers"
import type { Package } from "@dpkit/core"
import { denormalizePackage, stringifyDescriptor } from "@dpkit/core"
import {
  getPackageBasepath,
  readFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { makeZenodoApiRequest } from "../general/index.js"
import { denormalizeZenodoPackage } from "./process/denormalize.js"

/**
 * Save a package to Zenodo
 * @param props Object containing the package to save and Zenodo API details
 * @returns Object with the deposit URL and DOI
 */
export async function savePackageToZenodo(props: {
  datapackage: Package
  apiKey: string
  sandbox?: boolean
  publish?: boolean
}) {
  const { datapackage, apiKey, sandbox = false, publish = false } = props

  // Create a new deposit
  const depositMetadata = denormalizeZenodoPackage({ datapackage })
  const deposit = await makeZenodoApiRequest({
    endpoint: "/deposit/depositions",
    method: "POST",
    payload: depositMetadata,
    apiKey,
    sandbox,
  })

  // Get the deposit ID and bucket URL for file uploads
  const depositId = deposit.id as number
  const bucketUrl = deposit.links.bucket as string

  // Upload resource files
  const basepath = getPackageBasepath({ datapackage })
  for (const resource of datapackage.resources || []) {
    if (!resource.path) continue

    await saveResourceFiles({
      resource,
      basepath,
      withRemote: false,
      saveFile: async props => {
        // Upload the file to Zenodo
        const filename = props.denormalizedPath
        const fileData = await blob(
          await readFileStream({ path: props.normalizedPath }),
        )

        await makeZenodoApiRequest({
          endpoint: `${bucketUrl}/${filename}`,
          method: "PUT",
          upload: {
            name: filename,
            data: fileData,
          },
          apiKey,
          sandbox,
        })

        return `${bucketUrl}/${filename}`
      },
    })
  }

  // Upload datapackage.json as well
  const descriptor = denormalizePackage({ datapackage, basepath })
  await makeZenodoApiRequest({
    endpoint: `${bucketUrl}/datapackage.json`,
    method: "PUT",
    upload: {
      name: "datapackage.json",
      data: new Blob([stringifyDescriptor({ descriptor })]),
    },
    apiKey,
    sandbox,
  })

  // Publish the deposit if requested
  if (publish) {
    await makeZenodoApiRequest({
      endpoint: `/deposit/depositions/${depositId}/actions/publish`,
      method: "POST",
      apiKey,
      sandbox,
    })
  }

  // Return deposit information
  const baseUrl = sandbox ? "https://sandbox.zenodo.org" : "https://zenodo.org"

  return {
    depositUrl: `${baseUrl}/record/${depositId}`,
    depositId: depositId.toString(),
    doi: deposit.metadata?.doi as string,
  }
}
