import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

describe("parseGeojsonField", () => {
  it.each([
    // Valid JSON objects
    ['{"name":"John","age":30}', { name: "John", age: 30 }],
    ['{"numbers":[1,2,3]}', { numbers: [1, 2, 3] }],
    ['{"nested":{"prop":"value"}}', { nested: { prop: "value" } }],
    ["{}", {}],

    // JSON but not an object
    ["[1,2,3]", null],
    ['["a","b","c"]', null],

    // Trimming whitespace
    //[' {"name":"John"} ', { name: "John" }],
    //['\t{"name":"John"}\n', { name: "John" }],

    // Invalid JSON
    //["{invalid}", null],
    ["not json", null],
    ["", null],
    ["null", null],
    ["undefined", null],
  ])("%s -> %s", async (cell, value) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "geojson" as const }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    const res = df.getColumn("name").get(0)
    expect(res ? JSON.parse(res) : res).toEqual(value)
  })
})

describe("stringifyGeojsonField", () => {
  it.each([
    // GeoJSON Point
    ['{"type":"Point","coordinates":[125.6,10.1]}', '{"type":"Point","coordinates":[125.6,10.1]}'],
    
    // GeoJSON LineString
    ['{"type":"LineString","coordinates":[[125.6,10.1],[125.7,10.2]]}', '{"type":"LineString","coordinates":[[125.6,10.1],[125.7,10.2]]}'],
    
    // GeoJSON Polygon
    ['{"type":"Polygon","coordinates":[[[125.6,10.1],[125.7,10.1],[125.7,10.2],[125.6,10.2],[125.6,10.1]]]}', '{"type":"Polygon","coordinates":[[[125.6,10.1],[125.7,10.1],[125.7,10.2],[125.6,10.2],[125.6,10.1]]]}'],
    
    // GeoJSON Feature
    ['{"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Sample Point"}}', '{"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Sample Point"}}'],
    
    // GeoJSON FeatureCollection
    ['{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Point 1"}}]}', '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[125.6,10.1]},"properties":{"name":"Point 1"}}]}'],
    
    // Empty GeoJSON object
    ['{}', '{}'],
    
    // Null handling
    [null, null],
  ])("%s -> %s", async (value, expected) => {
    const table = DataFrame({ name: [value] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "geojson" as const }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
