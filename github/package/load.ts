import { makeGitHubApiRequest } from "../general/index.js"
import type { GitHubResource } from "../resource/Resource.js"
import type { GitHubPackage } from "./Package.js"
import { normalizeGitHubPackage } from "./process/normalize.js"

/**
 * Load a package from a GitHub repository
 * @param props Object containing the URL to the GitHub repository
 * @returns Package object
 */
export async function loadPackageFromGithub(props: {
  repositoryUrl: string
  apiKey: string
  branch?: string
}) {
  const { repositoryUrl, apiKey, branch } = props

  // Extract owner and repo from URL
  const { owner, repo } = extractRepositoryInfo({ repositoryUrl })
  if (!owner || !repo) {
    throw new Error(
      `Failed to extract repository info from URL: ${repositoryUrl}`,
    )
  }

  // Get repository metadata
  const githubPackage = await loadGitHubRepository({
    owner,
    repo,
    apiKey,
  })

  // Get repository contents
  const branchName = branch || githubPackage.default_branch
  const resources = await loadGitHubRepositoryContents({
    owner,
    repo,
    apiKey,
    path: "",
    ref: branchName,
  })

  // Add resources to the package
  githubPackage.resources = resources

  // Convert GitHub repository to Frictionless Data Package
  const datapackage = normalizeGitHubPackage({ githubPackage })

  return datapackage
}

/**
 * Extract repository owner and name from URL
 *
 * Examples:
 * - https://github.com/frictionlessdata/datapackage-js
 * - https://github.com/frictionlessdata/datapackage-js.git
 */
function extractRepositoryInfo(props: { repositoryUrl: string }): {
  owner: string | undefined
  repo: string | undefined
} {
  try {
    const url = new URL(props.repositoryUrl)

    // Handle GitHub URLs
    if (url.hostname === "github.com") {
      const pathParts = url.pathname.split("/").filter(Boolean)
      if (pathParts.length >= 2) {
        const owner = pathParts[0]
        // Remove .git extension if present
        let repo = pathParts[1]
        if (repo?.endsWith(".git")) {
          repo = repo.substring(0, repo.length - 4)
        }
        return { owner, repo }
      }
    }

    return { owner: undefined, repo: undefined }
  } catch (error) {
    return { owner: undefined, repo: undefined }
  }
}

/**
 * Fetch repository data from GitHub API
 */
async function loadGitHubRepository(props: {
  owner: string
  repo: string
  apiKey: string
}): Promise<GitHubPackage> {
  const { owner, repo, apiKey } = props

  const result = await makeGitHubApiRequest({
    endpoint: "/repos/:owner/:repo",
    owner,
    repo,
    apiKey,
  })

  return result as GitHubPackage
}

/**
 * Fetch repository contents from GitHub API
 */
async function loadGitHubRepositoryContents(props: {
  owner: string
  repo: string
  apiKey: string
  path: string
  ref?: string
}): Promise<GitHubResource[]> {
  const { owner, repo, apiKey, path, ref } = props

  const endpoint = `/repos/:owner/:repo/contents/${path}${ref ? `?ref=${ref}` : ""}`

  const result = await makeGitHubApiRequest({
    endpoint,
    owner,
    repo,
    apiKey,
  })

  // Handle both single file and directory responses
  const contents = Array.isArray(result) ? result : [result]
  return contents as GitHubResource[]
}
