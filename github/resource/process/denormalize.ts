import type { Resource } from "@dpkit/core"
import type { GithubResource } from "../Resource.ts"

/**
 * Denormalizes a Frictionless Data resource to Github file format
 * This is primarily used for file uploads/updates
 * @param props Object containing the Resource to denormalize
 * @returns Partial Github Resource object for API operations
 */
export function denormalizeGithubResource(
  resource: Resource,
): Partial<GithubResource> {
  if (!resource.path && !resource.name) {
    return {}
  }

  const githubResource: Partial<GithubResource> = {
    path: resource.name, // Use resource name as path within repo
  }

  return githubResource
}
