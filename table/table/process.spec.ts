import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "./process.js"

describe("processTable (exact)", () => {
  it.each([
    {
      description: "should work without schema",
      table: DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      }).lazy(),
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work with schema",
      table: DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      }).lazy(),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work with less fields in data",
      table: DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      }).lazy(),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
          { name: "other", type: "boolean" },
        ],
      },
      records: [
        { id: 1, name: "english", other: null },
        { id: 2, name: "中文", other: null },
      ],
    },
    {
      description: "should work with more fields in data",
      table: DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
        other: [true, false],
      }).lazy(),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work based on fields order",
      table: DataFrame({
        field1: [1, 2],
        field2: ["english", "中文"],
      }).lazy(),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work based on field names (equal)",
      table: DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      }).lazy(),
      schema: {
        fieldsMatch: "equal",
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work based on field names (subset)",
      table: DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      }).lazy(),
      schema: {
        fieldsMatch: "subset",
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work based on field names (superset)",
      table: DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      }).lazy(),
      schema: {
        fieldsMatch: "superset",
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should work based on field names (partial)",
      table: DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      }).lazy(),
      schema: {
        fieldsMatch: "partial",
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should parse string columns",
      table: DataFrame({
        id: ["1", "2"],
        name: ["english", "中文"],
      }).lazy(),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
  ])("$description", async ({ table, schema, records }) => {
    // @ts-ignore
    const ldf = await processTable({ table, schema })
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })
})
