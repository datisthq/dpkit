import { Buffer } from "node:buffer"
import { buffer } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/core"
import { denormalizePackage, stringifyDescriptor } from "@dpkit/core"
import { getPackageBasepath, loadFileStream } from "@dpkit/file"
import { saveResourceFiles } from "@dpkit/file"
import { makeGithubApiRequest } from "../general/index.js"
import type { GithubPackage } from "./Package.js"

/**
 * Save a package to a Github repository
 * @param props Object containing the package to save and Github details
 * @returns Object with the repository URL
 */
export async function savePackageToGithub(
  dataPackage: Package,
  options: {
    apiKey: string
    repo: string
    org?: string
  },
) {
  const { apiKey, org, repo } = options
  const basepath = getPackageBasepath(dataPackage)

  const githubPackage = await makeGithubApiRequest<GithubPackage>({
    endpoint: org ? `/orgs/${org}/repos` : "/user/repos",
    payload: { name: repo, auto_init: true },
    method: "POST",
    apiKey,
  })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    if (!resource.path) continue

    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote: false,
        saveFile: async props => {
          const stream = await loadFileStream(props.normalizedPath)

          const payload = {
            path: props.denormalizedPath,
            content: Buffer.from(await buffer(stream)).toString("base64"),
            message: `Added file "${props.denormalizedPath}"`,
          }

          await makeGithubApiRequest({
            endpoint: `/repos/${githubPackage.owner.login}/${repo}/contents/${props.denormalizedPath}`,
            method: "PUT",
            payload,
            apiKey,
          })

          return props.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  for (const denormalizedPath of ["datapackage.json"]) {
    const payload = {
      path: denormalizedPath,
      message: `Added file "${denormalizedPath}"`,
      content: Buffer.from(stringifyDescriptor(descriptor)).toString("base64"),
    }

    await makeGithubApiRequest({
      endpoint: `/repos/${githubPackage.owner.login}/${repo}/contents/${denormalizedPath}`,
      method: "PUT",
      payload,
      apiKey,
    })
  }

  return {
    path: `https://raw.githubusercontent.com/${githubPackage.owner.login}/${repo}/refs/heads/main/dataPackage.json`,
    repoUrl: githubPackage.html_url,
  }
}
