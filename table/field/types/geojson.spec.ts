import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("validateGeojsonField", () => {
  it("should not errors for valid GeoJSON Point", async () => {
    const table = pl
      .DataFrame({
        location: [
          '{"type":"Point","coordinates":[0,0]}',
          '{"type":"Point","coordinates":[12.5,41.9]}',
          '{"type":"Point","coordinates":[-73.9,40.7]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for valid GeoJSON geometries", async () => {
    const table = pl
      .DataFrame({
        geometry: [
          '{"type":"LineString","coordinates":[[0,0],[1,1]]}',
          '{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}',
          '{"type":"MultiPoint","coordinates":[[0,0],[1,1]]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "geometry",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for valid GeoJSON Feature", async () => {
    const table = pl
      .DataFrame({
        feature: [
          '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"Test"}}',
          '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[0,0],[1,1]]},"properties":{"id":1}}',
          '{"type":"Feature","geometry":null,"properties":{}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "feature",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for valid GeoJSON FeatureCollection", async () => {
    const table = pl
      .DataFrame({
        collection: [
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}}]}',
          '{"type":"FeatureCollection","features":[]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "collection",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for null values", async () => {
    const table = pl
      .DataFrame({
        location: [
          '{"type":"Point","coordinates":[0,0]}',
          null,
          '{"type":"Feature","geometry":null,"properties":{}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should errors for JSON arrays", async () => {
    const table = pl
      .DataFrame({
        data: [
          '{"type":"Point","coordinates":[0,0]}',
          "[[0,0],[1,1]]",
          '{"type":"Feature","geometry":null,"properties":{}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 2,
        cell: "[[0,0],[1,1]]",
      },
    ])
  })

  it("should errors for invalid JSON", async () => {
    const table = pl
      .DataFrame({
        data: [
          '{"type":"Point","coordinates":[0,0]}',
          "invalid json",
          "{broken}",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/type")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "geojson",
      rowNumber: 2,
      cell: "invalid json",
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "geojson",
      rowNumber: 3,
      cell: "{broken}",
    })
  })

  it("should errors for empty strings", async () => {
    const table = pl
      .DataFrame({
        data: [
          '{"type":"Point","coordinates":[0,0]}',
          "",
          '{"type":"Feature","geometry":null,"properties":{}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 2,
        cell: "",
      },
    ])
  })

  it("should errors for JSON primitives", async () => {
    const table = pl
      .DataFrame({
        data: ['"string"', "123", "true", "false", "null"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 1,
        cell: '"string"',
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 2,
        cell: "123",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 3,
        cell: "true",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 4,
        cell: "false",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "geojson",
        rowNumber: 5,
        cell: "null",
      },
    ])
  })

  it("should errors for invalid GeoJSON Point coordinates", async () => {
    const table = pl
      .DataFrame({
        location: [
          '{"type":"Point","coordinates":[0,0]}',
          '{"type":"Point","coordinates":[0]}',
          '{"type":"Point","coordinates":[0,0,0,0]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "location",
      fieldType: "geojson",
      rowNumber: 2,
      cell: '{"type":"Point","coordinates":[0]}',
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "location",
      fieldType: "geojson",
      rowNumber: 3,
      cell: '{"type":"Point","coordinates":[0,0,0,0]}',
    })
  })

  it("should errors for invalid GeoJSON LineString", async () => {
    const table = pl
      .DataFrame({
        line: [
          '{"type":"LineString","coordinates":[[0,0],[1,1]]}',
          '{"type":"LineString","coordinates":[[0,0]]}',
          '{"type":"LineString","coordinates":[0,0]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "line",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "line",
      fieldType: "geojson",
      rowNumber: 2,
      cell: '{"type":"LineString","coordinates":[[0,0]]}',
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "line",
      fieldType: "geojson",
      rowNumber: 3,
      cell: '{"type":"LineString","coordinates":[0,0]}',
    })
  })

  it("should errors for incomplete GeoJSON Feature", async () => {
    const table = pl
      .DataFrame({
        feature: [
          '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}}',
          '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]}}',
          '{"type":"Feature","properties":{}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "feature",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "feature",
      fieldType: "geojson",
      rowNumber: 2,
      cell: '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]}}',
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "feature",
      fieldType: "geojson",
      rowNumber: 3,
      cell: '{"type":"Feature","properties":{}}',
    })
  })

  it("should errors for invalid GeoJSON FeatureCollection", async () => {
    const table = pl
      .DataFrame({
        collection: [
          '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}}]}',
          '{"type":"FeatureCollection"}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "collection",
          type: "geojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "collection",
        fieldType: "geojson",
        rowNumber: 2,
        cell: '{"type":"FeatureCollection"}',
      },
    ])
  })

  it("should not validate jsonSchema constraints for geojson fields", async () => {
    const table = pl
      .DataFrame({
        location: [
          '{"type":"Point","coordinates":[0,0]}',
          '{"type":"Point","coordinates":[100,200]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                coordinates: {
                  type: "array",
                  items: { type: "number", minimum: -50, maximum: 50 },
                },
              },
            },
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for valid TopoJSON", async () => {
    const table = pl
      .DataFrame({
        topology: [
          '{"type":"Topology","objects":{"example":{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[0,0]}]}},"arcs":[]}',
          '{"type":"Topology","objects":{"collection":{"type":"GeometryCollection","geometries":[]}},"arcs":[]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "topology",
          type: "geojson",
          format: "topojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should errors for invalid TopoJSON structure", async () => {
    const table = pl
      .DataFrame({
        topology: [
          '{"type":"Topology","objects":{"example":{"type":"GeometryCollection","geometries":[]}},"arcs":[]}',
          '{"type":"Topology","objects":{}}',
          '{"type":"Topology"}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "topology",
          type: "geojson",
          format: "topojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "topology",
      fieldType: "geojson",
      fieldFormat: "topojson",
      rowNumber: 2,
      cell: '{"type":"Topology","objects":{}}',
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "topology",
      fieldType: "geojson",
      fieldFormat: "topojson",
      rowNumber: 3,
      cell: '{"type":"Topology"}',
    })
  })

  it("should accept TopoJSON geometry objects", async () => {
    const table = pl
      .DataFrame({
        geometry: [
          '{"type":"Point","coordinates":[0,0]}',
          '{"type":"LineString","arcs":[0,1]}',
          '{"type":"Polygon","arcs":[[0,1,2]]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "geometry",
          type: "geojson",
          format: "topojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should handle null values for topojson format", async () => {
    const table = pl
      .DataFrame({
        topology: [
          '{"type":"Topology","objects":{"example":{"type":"GeometryCollection","geometries":[]}},"arcs":[]}',
          null,
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "topology",
          type: "geojson",
          format: "topojson",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })
})
