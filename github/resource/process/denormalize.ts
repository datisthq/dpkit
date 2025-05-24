import type { Resource } from "@dpkit/core"
import type { GithubResource } from "../Resource.js"

/**
 * Denormalizes a Frictionless Data resource to Github file format
 * This is primarily used for file uploads/updates
 * @param props Object containing the Resource to denormalize
 * @returns Partial Github Resource object for API operations
 */
export function denormalizeGithubResource(props: {
  resource: Resource
  content?: string
}): Partial<GithubResource> {
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

  const githubResource: Partial<GithubResource> = {
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
