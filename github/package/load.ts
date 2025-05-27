import { mergePackage } from "@dpkit/core"
import { makeGithubApiRequest } from "../general/index.js"
import type { GithubResource } from "../resource/index.js"
import type { GithubPackage } from "./Package.js"
import { normalizeGithubPackage } from "./process/normalize.js"

/**
 * Load a package from a Github repository
 * @param props Object containing the URL to the Github repository
 * @returns Package object
 */
export async function loadPackageFromGithub(props: {
  repoUrl: string
  apiKey?: string
}) {
  const { repoUrl, apiKey } = props

  // Extract owner and repo from URL
  const { owner, repo } = extractRepositoryInfo({ repoUrl })
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

  const datapackage = mergePackage({
    datapackage: normalizeGithubPackage({ githubPackage }),
  })

  return datapackage
}

/**
 * Extract repository owner and name from URL
 *
 * Examples:
 * - https://github.com/owner/repo
 */
function extractRepositoryInfo(props: { repoUrl: string }) {
  const url = new URL(props.repoUrl)
  const [owner, repo] = url.pathname.split("/").filter(Boolean)
  return { owner, repo }
}
