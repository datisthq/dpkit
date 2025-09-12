import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

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
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [{ name: "name", type: "geopoint" as const }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("array format", () => {
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
      // TODO: fix this
      //["not a geopoint", null],
      //["", null],
      //["[90.50]", null],
      //["[90.50, 45.50, 0]", null],
      //["['lon', 'lat']", null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "geopoint" as const, format: "array" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("object format", () => {
    it.each([
      // Valid geopoints in object format
      ['{"lon": 90.50, "lat": 45.50}', [90.5, 45.5]],
      ['{"lon": 0, "lat": 0}', [0, 0]],
      ['{"lon": -122.40, "lat": 37.78}', [-122.4, 37.78]],
      ['{"lon": -180.0, "lat": -90.0}', [-180.0, -90.0]],
      ['{"lon": 180.0, "lat": 90.0}', [180.0, 90.0]],

      // With whitespace
      [' {"lon": 90.50, "lat": 45.50} ', [90.5, 45.5]],

      // TODO: fix this
      // Invalid formats
      //["not a geopoint", null],
      //["", null],
      //['{"longitude": 90.50, "latitude": 45.50}', null],
      //['{"lon": 90.50}', null],
      //['{"lat": 45.50}', null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

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

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })
})

describe("stringifyGeopointField", () => {
  describe("default format", () => {
    it.each([
      // Coordinate arrays to default format (lon,lat)
      [[90.5, 45.5], "90.5,45.5"],
      [[0, 0], "0.0,0.0"],
      [[-122.4, 37.78], "-122.4,37.78"],
      [[-180.0, -90.0], "-180.0,-90.0"],
      [[180.0, 90.0], "180.0,90.0"],

      // With precise decimals
      [[125.6789, 10.1234], "125.6789,10.1234"],

      // Null handling
      //[null, null],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.Float64)),
      ]).lazy()

      const schema = {
        fields: [{ name: "name", type: "geopoint" as const }],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })

  describe("array format", () => {
    it.each([
      // Coordinate arrays to array format string
      [[90.5, 45.5], "[90.5,45.5]"],
      [[0, 0], "[0.0,0.0]"],
      [[-122.4, 37.78], "[-122.4,37.78]"],
      [[-180.0, -90.0], "[-180.0,-90.0]"],
      [[180.0, 90.0], "[180.0,90.0]"],

      // Null handling
      //[null, null],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.Float64)),
      ]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "geopoint" as const, format: "array" as const },
        ],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })

  describe("object format", () => {
    it.each([
      // Coordinate arrays to object format string
      [[90.5, 45.5], '{"lon":90.5,"lat":45.5}'],
      [[0, 0], '{"lon":0.0,"lat":0.0}'],
      [[-122.4, 37.78], '{"lon":-122.4,"lat":37.78}'],
      [[-180.0, -90.0], '{"lon":-180.0,"lat":-90.0}'],
      [[180.0, 90.0], '{"lon":180.0,"lat":90.0}'],

      // Null handling
      //[null, null],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.Float64)),
      ]).lazy()

      const schema = {
        fields: [
          {
            name: "name",
            type: "geopoint" as const,
            format: "object" as const,
          },
        ],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })
})
