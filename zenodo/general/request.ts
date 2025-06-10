import type { Descriptor } from "@dpkit/core"

export async function makeZenodoApiRequest<T = Descriptor>(options: {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  payload?: Descriptor
  upload?: { name: string; data: Blob }
  apiKey?: string
  sandbox?: boolean
}) {
  const {
    endpoint,
    method = "GET",
    payload,
    upload,
    apiKey,
    sandbox = false,
  } = options

  let body: string | FormData | undefined
  const headers: Record<string, any> = {}

  const baseUrl = sandbox
    ? "https://sandbox.zenodo.org/api"
    : "https://zenodo.org/api"
  const url = new URL(`${baseUrl}${endpoint}`)

  if (apiKey) {
    url.searchParams.append("access_token", apiKey)
  }

  if (upload) {
    body = new FormData()
    body.append("file", upload.data, upload.name)

    if (payload) {
      for (const [key, value] of Object.entries(payload)) {
        body.append(key, JSON.stringify(value))
      }
    }
  } else if (payload) {
    body = JSON.stringify(payload)
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Zenodo API error: ${response.status} ${response.statusText}\n${errorText}`,
    )
  }

  return (await response.json()) as T
}
