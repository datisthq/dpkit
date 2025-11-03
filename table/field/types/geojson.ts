import type { GeojsonField } from "@dpkit/core"
import geojsonProfile from "../../profiles/geojson.json" with { type: "json" }
import topojsonProfile from "../../profiles/topojson.json" with { type: "json" }
import type { Table } from "../../table/index.ts"
import { inspectJsonField } from "./json.ts"

export async function inspectGeojsonField(field: GeojsonField, table: Table) {
  return inspectJsonField(field, table, {
    formatProfile:
      field.format === "topojson" ? topojsonProfile : geojsonProfile,
  })
}
