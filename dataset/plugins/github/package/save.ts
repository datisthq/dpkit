import { Buffer } from "node:buffer"
import { buffer } from "node:stream/consumers"
import type { Descriptor, Package } from "@dpkit/metadata"
import { stringifyDescriptor } from "@dpkit/metadata"
import { convertPackageToDescriptor } from "@dpkit/metadata"
import { getPackageBasepath } from "../../../package/index.ts"
import { saveResourceFiles } from "../../../resource/index.ts"
import { loadFileStream } from "../../../stream/index.ts"
import { makeGithubApiRequest } from "../github/index.ts"
import type { GithubPackage } from "./Package.ts"

/**
 * Save a package to a Github repository
 * @param options Object containing the package to save and Github details
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
        saveFile: async options => {
          const stream = await loadFileStream(options.normalizedPath)

          const payload = {
            path: options.denormalizedPath,
            content: Buffer.from(await buffer(stream)).toString("base64"),
            message: `Added file "${options.denormalizedPath}"`,
          }

          await makeGithubApiRequest({
            endpoint: `/repos/${githubPackage.owner.login}/${repo}/contents/${options.denormalizedPath}`,
            method: "PUT",
            payload,
            apiKey,
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
