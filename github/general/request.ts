import type { Descriptor } from "@dpkit/core"

export interface GitHubApiRequestProps {
  /**
   * GitHub API endpoint path
   */
  endpoint: string

  /**
   * HTTP method for the request
   */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

  /**
   * Request payload
   */
  payload?: Descriptor

  /**
   * File to upload
   */
  upload?: {
    name: string
    data: Blob
    path?: string // Path within repository
  }

  /**
   * GitHub personal access token
   */
  apiKey: string

  /**
   * Repository owner/organization
   */
  owner: string

  /**
   * Repository name
   */
  repo: string
}

/**
 * Makes a request to the GitHub API
 */
export async function makeGitHubApiRequest(props: GitHubApiRequestProps) {
  const {
    endpoint,
    method = "GET",
    payload,
    upload,
    apiKey,
    owner,
    repo,
  } = props

  let body: string | FormData | undefined
  const headers: Descriptor = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${apiKey}`,
    "X-GitHub-Api-Version": "2022-11-28",
  }

  // Create full API URL
  const baseUrl = "https://api.github.com"
  let url = `${baseUrl}${endpoint}`

  // Replace :owner and :repo placeholders if present
  url = url.replace(/:owner/g, owner).replace(/:repo/g, repo)

  if (upload) {
    body = new FormData()
    body.append("file", upload.data, upload.name)

    if (payload) {
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === "object" && value !== null) {
          body.append(key, JSON.stringify(value))
        } else {
          body.append(key, String(value))
        }
      }
    }
  } else if (payload) {
    body = JSON.stringify(payload)
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}\n${errorText}`,
    )
  }

  // Check for no content responses
  if (response.status === 204) {
    return {}
  }

  return (await response.json()) as Descriptor
}
