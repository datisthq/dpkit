import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"

export async function loadInlineTable(resource: Partial<Resource>) {
  const polarsData = getPolarsData({ data: resource.data })

  const table = DataFrame(polarsData).lazy()
  return table
}

export type PolarsData = Record<string, unknown[]>

function getPolarsData(props: { data: Resource["data"] }) {
  const { data } = props

  if (!Array.isArray(data)) {
    return {}
  }

  const isArrays = data.every(row => Array.isArray(row))

  const polarsData = isArrays
    ? getPolarsDataFromArrays({ data })
    : getPolarsDataFromObjects({ data })

  const maxLength = Math.max(
    ...Object.values(polarsData).map(values => values.length),
  )

  // Pad shorter columns with nulls
  for (const key in polarsData) {
    const values = polarsData[key] ?? []
    if (values.length < maxLength) {
      polarsData[key] = [
        ...values,
        ...Array(maxLength - values.length).fill(null),
      ]
    }
  }

  return polarsData
}

function getPolarsDataFromArrays(props: { data: unknown[][] }) {
  const polarsData: PolarsData = {}

  const [header, ...rows] = props.data

  if (!header) {
    return polarsData
  }

  for (const row of rows) {
    for (const [index, value] of row.entries()) {
      const key = header[index]
      if (typeof key === "string") {
        polarsData[key] = polarsData[key] || []
        polarsData[key].push(value)
      }
    }
  }

  return polarsData
}

function getPolarsDataFromObjects(props: { data: Record<string, unknown>[] }) {
  const polarsData: PolarsData = {}

  for (const row of props.data) {
    for (const [key, value] of Object.entries(row)) {
      if (typeof key === "string") {
        polarsData[key] = polarsData[key] || []
        polarsData[key].push(value)
      }
    }
  }

  return polarsData
}
