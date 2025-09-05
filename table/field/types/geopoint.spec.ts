import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

describe("parseGeopointField", () => {
  describe("default format", () => {
    it.each([
      // Valid geopoints in default format (lon,lat)
      ["90.50,45.50", [90.5, 45.5]],
      ["0,0", [0, 0]],
      //["-122.40, 37.78", [-122.4, 37.78]],
      //["-180.0,-90.0", [-180.0, -90.0]],
      //["180.0, 90.0", [180.0, 90.0]],

      // With whitespace
      //[" 90.50, 45.50 ", [90.5, 45.5]],

      // Invalid formats
      //["not a geopoint", null],
      //["", null],
      //["90.50", null],
      //["90.50,lat", null],
      //["lon,45.50", null],
      //["90.50,45.50,0", null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame({ name: [cell] }).lazy()
      const schema = {
        fields: [{ name: "name", type: "geopoint" as const }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe.skip("array format", () => {
    it.each([
      // Valid geopoints in array format
      ["[90.50, 45.50]", [90.5, 45.5]],
      ["[0, 0]", [0, 0]],
      ["[-122.40, 37.78]", [-122.4, 37.78]],
      ["[-180.0, -90.0]", [-180.0, -90.0]],
      ["[180.0, 90.0]", [180.0, 90.0]],

      // With whitespace
      [" [90.50, 45.50] ", [90.5, 45.5]],

      // Invalid formats
      ["not a geopoint", null],
      ["", null],
      ["[90.50]", null],
      ["[90.50, 45.50, 0]", null],
      ["['lon', 'lat']", null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame({ name: [cell] }).lazy()
      const schema = {
        fields: [
          { name: "name", type: "geopoint" as const, format: "array" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").get(0)).toEqual(value)
    })
  })

  describe.skip("object format", () => {
    it.each([
      // Valid geopoints in object format
      ['{"lon": 90.50, "lat": 45.50}', [90.5, 45.5]],
      ['{"lon": 0, "lat": 0}', [0, 0]],
      ['{"lon": -122.40, "lat": 37.78}', [-122.4, 37.78]],
      ['{"lon": -180.0, "lat": -90.0}', [-180.0, -90.0]],
      ['{"lon": 180.0, "lat": 90.0}', [180.0, 90.0]],

      // With whitespace
      [' {"lon": 90.50, "lat": 45.50} ', [90.5, 45.5]],

      // Invalid formats
      ["not a geopoint", null],
      ["", null],
      ['{"longitude": 90.50, "latitude": 45.50}', null],
      ['{"lon": 90.50}', null],
      ['{"lat": 45.50}', null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame({ name: [cell] }).lazy()
      const schema = {
        fields: [
          {
            name: "name",
            type: "geopoint" as const,
            format: "object" as const,
          },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").get(0)).toEqual(value)
    })
  })
})
