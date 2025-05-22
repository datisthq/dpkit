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
  payload: Descriptor | FormData
  apiKey?: string
}) {
  const url = new URL(props.ckanUrl)

  url.pathname = `/api/3/action/${props.action}`

  const headers: Descriptor = {}
  if (!(props.payload instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  if (props.apiKey) {
    headers.Authorization = props.apiKey
  }

  const body =
    props.payload instanceof FormData
      ? props.payload
      : JSON.stringify(props.payload)

  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body,
  })

  return response
}
