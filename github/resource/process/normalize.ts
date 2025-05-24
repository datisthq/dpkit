import type { Resource } from "@dpkit/core"
import { getFormat } from "@dpkit/core"
import type { GitHubResource } from "../Resource.js"

/**
 * Normalizes a GitHub file to Frictionless Data resource format
 * @param props Object containing the GitHub file to normalize
 * @returns Normalized Resource object
 */
export function normalizeGitHubResource(props: {
  githubResource: GitHubResource
}): Resource {
  const { githubResource } = props

  const resource: Resource = {
    name: githubResource.name,
    path: githubResource.download_url,
    bytes: githubResource.size,
    hash: githubResource.sha,
  }

  // Extract file format from name
  const format = getFormat({ filename: githubResource.name })
  if (format) {
    resource.format = format
  }

  return resource
}
