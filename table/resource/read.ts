import type { Resource, Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { DataFrame, Series } from "nodejs-polars"
import { convertSchemaToPolars } from "../schema/index.js"

export async function readInlineResourceTable(props: { resource: Resource }) {
  const { resource } = props
  const polarsSeries = await getPolarsSeries({ resource })
  return DataFrame(polarsSeries).lazy()
}

async function getPolarsSeries(props: { resource: Resource }) {
  const { resource } = props

  const polarsData = getPolarsData({ resource })
  const polarsSchema = await getPolarsSchema({ resource })

  if (!polarsSchema) {
    return polarsData
  }

  return Object.fromEntries(
    Object.entries(polarsSchema).map(([key, type]) => {
      const values = polarsData[key] ?? []
      console.log(key, values, type)
      return [key, Series(key, values, type)]
    }),
  )
}

type PolarsData = Record<string, unknown[]>

function getPolarsData(props: { resource: Resource }) {
  const { resource } = props
  const polarsData: PolarsData = {}

  if (!Array.isArray(resource.data)) {
    return polarsData
  }

  const isArrays = resource.data.every(row => Array.isArray(row))

  return isArrays
    ? getPolarsDataFromArrays({ data: resource.data })
    : getPolarsDataFromObjects({ data: resource.data })
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

async function getPolarsSchema(props: { resource: Resource }) {
  const { resource } = props

  if (!resource.schema) {
    return undefined
  }

  const schema =
    typeof resource.schema === "string"
      ? await loadSchema({ path: resource.schema })
      : resource.schema

  return convertSchemaToPolars({ schema })
}
