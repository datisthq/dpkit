import type { Resource } from "@dpkit/core"
import { getFilename, getFormat, getName } from "@dpkit/core"
import type { GithubResource } from "./Resource.ts"

/**
 * Normalizes a Github file to Frictionless Data resource format
 * @param props Object containing the Github file to normalize
 * @returns Normalized Resource object
 */
export function normalizeGithubResource(
  githubResource: GithubResource,
  options: {
    defaultBranch: string
  },
) {
  const path = normalizeGithubPath({
    ...githubResource,
    ref: options.defaultBranch,
  })

  const filename = getFilename(path)
  const resource: Resource = {
    path,
    name: getName(filename) ?? githubResource.sha,
    bytes: githubResource.size,
    hash: `sha1:${githubResource.sha}`,
    format: getFormat(filename),
    "github:key": githubResource.path,
    "github:url": path,
  }

  return resource
}

function normalizeGithubPath(options: {
  url: string
  ref: string
  path: string
}) {
  const url = new URL(options.url)
  const [owner, repo] = url.pathname.split("/").slice(2)
  return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${options.ref}/${options.path}`
}
