import type { Resource, Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { convertSchemaToPolars } from "../schema/index.js"

export async function readInlineResourceTable(props: { resource: Resource }) {
  const { resource } = props

  const polarsSchema = await getPolarsSchema({ resource })
  const polarsData = getPolarsData({ resource })

  console.log(polarsSchema)
  console.log(polarsData)

  return DataFrame(polarsData as any, {
    schema: polarsSchema as any,
    orient: "row",
  }).lazy()
}

async function getPolarsSchema(props: { resource: Resource }) {
  const { resource } = props

  if (!resource.schema) {
    return getPolarsSchemaFromData({ data: resource.data })
  }

  const schema =
    typeof resource.schema === "string"
      ? await loadSchema({ path: resource.schema })
      : resource.schema

  return convertSchemaToPolars({ schema })
}

function getPolarsSchemaFromData(props: { data: unknown }) {
  if (!Array.isArray(props.data)) {
    return []
  }

  const firstRow = props.data[0]
  if (Array.isArray(firstRow)) {
    return firstRow
  }

  const keys = new Set<string>()
  for (const row of props.data) {
    for (const key of Object.keys(row)) {
      keys.add(key)
    }
  }

  return Array.from(keys)
}

function getPolarsData(props: { resource: Resource }) {
  const { resource } = props

  if (!Array.isArray(resource.data)) {
    return []
  }

  const firstRow = resource.data[0]
  if (Array.isArray(firstRow)) {
    return resource.data.slice(1)
  }

  const polarsData: unknown[] = []
  for (const row of resource.data) {
    polarsData.push(...Object.values(row))
  }

  return polarsData
}
