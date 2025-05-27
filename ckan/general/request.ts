import type { Descriptor } from "@dpkit/core"

export async function makeCkanApiRequest<T = Descriptor>(props: {
  ckanUrl: string
  action: string
  payload: Descriptor
  upload?: { name: string; data: Blob }
  apiKey?: string
}) {
  let body: string | FormData
  const headers: Record<string, any> = {}

  const url = new URL(props.ckanUrl)
  url.pathname = `/api/3/action/${props.action}`

  if (props.apiKey) {
    headers.Authorization = props.apiKey
  }

  if (props.upload) {
    body = new FormData()
    body.append("upload", props.upload.data, props.upload.name)

    for (const [key, value] of Object.entries(props.payload)) {
      body.append(key, value)
    }
  } else {
    body = JSON.stringify(props.payload)
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
