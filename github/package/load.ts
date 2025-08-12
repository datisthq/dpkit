import { mergePackages } from "@dpkit/core"
import { makeGithubApiRequest } from "../github/index.ts"
import type { GithubResource } from "../resource/index.ts"
import type { GithubPackage } from "./Package.ts"
import { normalizeGithubPackage } from "./process/normalize.ts"

/**
 * Load a package from a Github repository
 * @param props Object containing the URL to the Github repository
 * @returns Package object
 */
export async function loadPackageFromGithub(
  repoUrl: string,
  options?: {
    apiKey?: string
  },
) {
  const { apiKey } = options ?? {}

  // Extract owner and repo from URL
  const { owner, repo } = extractRepositoryInfo(repoUrl)
  if (!owner || !repo) {
    throw new Error(`Failed to extract repository info from URL: ${repoUrl}`)
  }

  const githubPackage = await makeGithubApiRequest<GithubPackage>({
    endpoint: `/repos/${owner}/${repo}`,
    apiKey,
  })

  const ref = githubPackage.default_branch
  githubPackage.resources = (
    await makeGithubApiRequest<{ tree: GithubResource[] }>({
      endpoint: `/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
      apiKey,
    })
  ).tree

  const systemPackage = normalizeGithubPackage(githubPackage)
  const userPackagePath = systemPackage.resources
    .filter(resource => resource["github:key"] === "datapackage.json")
    .map(resource => resource["github:url"])
    .at(0)

  const datapackage = await mergePackages({ systemPackage, userPackagePath })
  datapackage.resources = datapackage.resources.map(resource => {
    // TODO: remove these keys completely
    return { ...resource, "github:key": undefined, "github:url": undefined }
  })

  return datapackage
}

/**
 * Extract repository owner and name from URL
 *
 * Examples:
 * - https://github.com/owner/repo
 */
function extractRepositoryInfo(repoUrl: string) {
  const url = new URL(repoUrl)
  const [owner, repo] = url.pathname.split("/").filter(Boolean)
  return { owner, repo }
}
