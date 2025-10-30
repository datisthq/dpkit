import type { GeojsonField } from "@dpkit/core"
import geojsonProfile from "../../profiles/geojson.json" with { type: "json" }
import topojsonProfile from "../../profiles/topojson.json" with { type: "json" }
import type { Table } from "../../table/index.ts"
import { validateJsonField } from "./json.ts"

export async function validateGeojsonField(field: GeojsonField, table: Table) {
  return validateJsonField(field, table, {
    formatProfile:
      field.format === "topojson" ? topojsonProfile : geojsonProfile,
  })
}
