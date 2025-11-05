import type { Descriptor } from "@dpkit/metadata"

export async function makeCkanApiRequest<T = Descriptor>(options: {
  ckanUrl: string
  action: string
  payload: Descriptor
  upload?: { name: string; data: Blob }
  apiKey?: string
}) {
  let body: string | FormData
  const headers: Record<string, any> = {}

  const url = new URL(options.ckanUrl)
  url.pathname = `/api/3/action/${options.action}`

  if (options.apiKey) {
    headers.Authorization = options.apiKey
  }

  if (options.upload) {
    body = new FormData()
    body.append("upload", options.upload.data, options.upload.name)

    for (const [key, value] of Object.entries(options.payload)) {
      body.append(key, value)
    }
  } else {
    body = JSON.stringify(options.payload)
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `CKAN API error: ${response.status} ${response.statusText}\n${errorText}`,
    )
  }

  const data = (await response.json()) as Descriptor
  if (!data.success) {
    throw new Error(`CKAN API error: ${data.error}`)
  }

  return data.result as T
}
