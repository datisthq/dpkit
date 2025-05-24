import type { Resource } from "@dpkit/core"
import type { GitHubResource } from "../Resource.js"

/**
 * Denormalizes a Frictionless Data resource to GitHub file format
 * This is primarily used for file uploads/updates
 * @param props Object containing the Resource to denormalize
 * @returns Partial GitHub Resource object for API operations
 */
export function denormalizeGitHubResource(props: {
  resource: Resource
  content?: string
}): Partial<GitHubResource> {
  const { resource, content } = props

  if (!resource.path && !resource.name) {
    return {}
  }

  // Get the filename from path or name
  const name =
    resource.name ||
    (typeof resource.path === "string"
      ? resource.path.split("/").pop() || "unknown"
      : "unknown")

  const githubResource: Partial<GitHubResource> = {
    name,
    path: resource.name, // Use resource name as path within repo
  }

  // Include content if provided
  if (content) {
    githubResource.content = content
    githubResource.encoding = "base64"
  }

  return githubResource
}
