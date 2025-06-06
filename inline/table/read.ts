import type { Resource } from "@dpkit/core"
import { processTable } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"

export async function readInlineTable(props: {
  resource: Resource
  dontProcess?: boolean
}) {
  const { resource } = props

  const polarsData = getPolarsData({ data: resource.data })
  const schema = resource.schema

  let table = DataFrame(polarsData).lazy()
  if (!props.dontProcess) {
    table = await processTable({ table, schema })
  }

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
