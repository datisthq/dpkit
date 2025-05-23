import type { Descriptor } from "@dpkit/core"

export async function makeGetCkanApiRequest(props: {
  ckanUrl: string
  action: string
  payload: Descriptor
}) {
  const url = new URL(props.ckanUrl)

  url.pathname = `/api/3/action/${props.action}`
  url.search = new URLSearchParams(props.payload).toString()

  const response = await fetch(url.toString())
  return response
}

export async function makePostCkanApiRequest(props: {
  ckanUrl: string
  action: string
  payload: Descriptor
  upload?: { name: string; data: Blob }
  apiKey?: string
}) {
  let body: string | FormData
  const headers: Descriptor = {}

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

  return response
}
