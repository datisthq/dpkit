import type { Descriptor } from "@dpkit/core"

export interface GithubApiRequestProps {
  /**
   * Github API endpoint path
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
   * Github personal access token
   */
  apiKey?: string
}

/**
 * Makes a request to the Github API
 */
export async function makeGithubApiRequest(props: GithubApiRequestProps) {
  const { endpoint, method = "GET", payload, upload, apiKey } = props

  let body: string | FormData | undefined
  const headers: Descriptor = {}

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`
  }

  // Create full API URL
  const baseUrl = "https://api.github.com"
  const url = `${baseUrl}${endpoint}`

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
      `Github API error: ${response.status} ${response.statusText}\n${errorText}`,
    )
  }

  // Check for no content responses
  if (response.status === 204) {
    return {}
  }

  return (await response.json()) as Descriptor
}
