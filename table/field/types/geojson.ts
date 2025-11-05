import type { GeojsonField } from "@dpkit/metadata"
import geojson from "../../assets/geojson.json" with { type: "json" }
import topojson from "../../assets/topojson.json" with { type: "json" }
import type { Table } from "../../table/index.ts"
import { inspectJsonField } from "./json.ts"

export async function inspectGeojsonField(field: GeojsonField, table: Table) {
  return inspectJsonField(field, table, {
    formatJsonSchema: field.format === "topojson" ? topojson : geojson,
  })
}
