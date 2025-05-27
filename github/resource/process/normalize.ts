import type { Resource } from "@dpkit/core"
import { getFilename, getFormat, getName } from "@dpkit/core"
import type { GithubResource } from "../Resource.js"

/**
 * Normalizes a Github file to Frictionless Data resource format
 * @param props Object containing the Github file to normalize
 * @returns Normalized Resource object
 */
export function normalizeGithubResource(props: {
  githubResource: GithubResource
}) {
  const { githubResource } = props

  const path = githubResource.path
  const filename = getFilename({ path })

  const name = getName({ filename }) ?? githubResource.sha
  const format = getFormat({ filename })

  const bytes = githubResource.size
  const hash = `sha1:${githubResource.sha}`

  const resource: Resource = { name, path, bytes, hash, format }

  if (githubResource.path === "datapackage.json") {
    resource["dpkit:isUserPackage"] = true
  }

  return resource
}
