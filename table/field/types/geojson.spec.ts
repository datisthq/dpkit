import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateGeojsonField", () => {
  it("should not report errors for valid GeoJSON Point", async () => {
    const table = DataFrame({
      location: [
        '{"type":"Point","coordinates":[0,0]}',
        '{"type":"Point","coordinates":[12.5,41.9]}',
        '{"type":"Point","coordinates":[-73.9,40.7]}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not report errors for valid GeoJSON geometries", async () => {
    const table = DataFrame({
      geometry: [
        '{"type":"LineString","coordinates":[[0,0],[1,1]]}',
        '{"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}',
        '{"type":"MultiPoint","coordinates":[[0,0],[1,1]]}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "geometry",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not report errors for valid GeoJSON Feature", async () => {
    const table = DataFrame({
      feature: [
        '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"Test"}}',
        '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[0,0],[1,1]]},"properties":{"id":1}}',
        '{"type":"Feature","geometry":null,"properties":{}}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "feature",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not report errors for valid GeoJSON FeatureCollection", async () => {
    const table = DataFrame({
      collection: [
        '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}}]}',
        '{"type":"FeatureCollection","features":[]}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "collection",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not report errors for null values", async () => {
    const table = DataFrame({
      location: [
        '{"type":"Point","coordinates":[0,0]}',
        null,
        '{"type":"Feature","geometry":null,"properties":{}}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for JSON arrays", async () => {
    const table = DataFrame({
      data: [
        '{"type":"Point","coordinates":[0,0]}',
        "[[0,0],[1,1]]",
        '{"type":"Feature","geometry":null,"properties":{}}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
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

  it("should report errors for invalid JSON", async () => {
    const table = DataFrame({
      data: [
        '{"type":"Point","coordinates":[0,0]}',
        "invalid json",
        '{"type":"Feature"}',
        "{broken}",
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
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
      rowNumber: 4,
      cell: "{broken}",
    })
  })

  it("should report errors for empty strings", async () => {
    const table = DataFrame({
      data: [
        '{"type":"Point","coordinates":[0,0]}',
        "",
        '{"type":"Feature","geometry":null,"properties":{}}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
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

  it("should report errors for JSON primitives", async () => {
    const table = DataFrame({
      data: ['"string"', "123", "true", "false", "null"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "geojson",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
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

  it("should not report errors for GeoJSON matching jsonSchema", async () => {
    const table = DataFrame({
      location: [
        '{"type":"Point","coordinates":[0,0]}',
        '{"type":"Point","coordinates":[12.5,41.9]}',
        '{"type":"Point","coordinates":[-73.9,40.7]}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                type: { type: "string", const: "Point" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 2,
                  maxItems: 2,
                },
              },
              required: ["type", "coordinates"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for GeoJSON not matching jsonSchema", async () => {
    const jsonSchema = {
      type: "object",
      properties: {
        type: { type: "string", const: "Point" },
        coordinates: {
          type: "array",
          items: { type: "number" },
          minItems: 2,
          maxItems: 2,
        },
      },
      required: ["type", "coordinates"],
    }

    const table = DataFrame({
      location: [
        '{"type":"Point","coordinates":[0,0]}',
        '{"type":"LineString","coordinates":[[0,0],[1,1]]}',
        '{"type":"Point"}',
        '{"type":"Point","coordinates":[0,0,0]}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "location",
          type: "geojson",
          constraints: {
            jsonSchema,
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/jsonSchema")).toHaveLength(3)
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "location",
      jsonSchema,
      rowNumber: 2,
      cell: '{"type":"LineString","coordinates":[[0,0],[1,1]]}',
    })
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "location",
      jsonSchema,
      rowNumber: 3,
      cell: '{"type":"Point"}',
    })
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "location",
      jsonSchema,
      rowNumber: 4,
      cell: '{"type":"Point","coordinates":[0,0,0]}',
    })
  })

  it("should validate complex GeoJSON Feature with jsonSchema", async () => {
    const table = DataFrame({
      feature: [
        '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"Valid","category":"test"}}',
        '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"Missing category"}}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "feature",
          type: "geojson",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                type: { type: "string", const: "Feature" },
                geometry: { type: "object" },
                properties: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                  },
                  required: ["name", "category"],
                },
              },
              required: ["type", "geometry", "properties"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "feature",
        // @ts-ignore
        jsonSchema: schema.fields[0].constraints?.jsonSchema,
        rowNumber: 2,
        cell: '{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"Missing category"}}',
      },
    ])
  })

  it("should validate GeoJSON FeatureCollection with jsonSchema", async () => {
    const table = DataFrame({
      collection: [
        '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}}]}',
        '{"type":"FeatureCollection","features":"invalid"}',
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "collection",
          type: "geojson",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                type: { type: "string", const: "FeatureCollection" },
                features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "Feature" },
                      geometry: { type: "object" },
                      properties: { type: "object" },
                    },
                    required: ["type", "geometry", "properties"],
                  },
                },
              },
              required: ["type", "features"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "collection",
        // @ts-ignore
        jsonSchema: schema.fields[0].constraints?.jsonSchema,
        rowNumber: 2,
        cell: '{"type":"FeatureCollection","features":"invalid"}',
      },
    ])
  })
})
