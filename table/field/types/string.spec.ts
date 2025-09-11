import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

// TODO: Implement proper tests
// TODO: Currently, it fails on to JS conversion from Polars
describe("parseStringField", () => {
  describe("email format", () => {
    it.each([
      // Valid emails
      ["user@example.com", "user@example.com"],
      ["test.email@domain.co.uk", "test.email@domain.co.uk"],
      ["user+tag@example.org", "user+tag@example.org"],
      ["first.last@subdomain.example.com", "first.last@subdomain.example.com"],
      ["user123@test-domain.com", "user123@test-domain.com"],

      // Invalid emails
      ["invalid-email", null],
      ["@example.com", null],
      ["user@", null],
      ["user@@example.com", null],
      ["user@example", null],
      ["user name@example.com", null],

      // Null handling
      ["", null],
    ])("$0 -> $1", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "string" as const, format: "email" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").dtype).toEqual(DataType.String)
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("uri format", () => {
    it.each([
      // Valid URIs
      ["https://example.com", "https://example.com"],
      [
        "http://www.google.com/search?q=test",
        "http://www.google.com/search?q=test",
      ],
      ["ftp://files.example.org/file.txt", "ftp://files.example.org/file.txt"],
      ["mailto:user@example.com", "mailto:user@example.com"],
      ["file:///path/to/file", "file:///path/to/file"],
      ["ssh://user@host:22/path", "ssh://user@host:22/path"],

      // Invalid URIs
      ["not-a-uri", null],
      ["://missing-scheme", null],
      ["http://", null],
      ["example.com", null],
      ["http:// space in uri", null],

      // Null handling
      ["", null],
    ])("$0 -> $1", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "string" as const, format: "uri" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").dtype).toEqual(DataType.String)
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("binary format", () => {
    it.each([
      // Valid base64 strings
      ["SGVsbG8gV29ybGQ=", "SGVsbG8gV29ybGQ="],
      ["YWJjZGVmZw==", "YWJjZGVmZw=="],
      ["VGVzdA==", "VGVzdA=="],
      ["QQ==", "QQ=="],
      ["Zg==", "Zg=="],
      ["Zm8=", "Zm8="],
      ["Zm9v", "Zm9v"],

      // Invalid base64 strings
      ["Hello World!", null],
      ["SGVsbG8gV29ybGQ===", null],
      ["Invalid@#$", null],
      ["SGVsb(8gV29ybGQ=", null],

      // Null handling
      ["", null],
    ])("$0 -> $1", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "string" as const, format: "binary" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").dtype).toEqual(DataType.String)
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("uuid format", () => {
    it.each([
      // Valid UUIDs
      [
        "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      ],

      // Invalid UUIDs
      ["f47ac10b-58cc-4372-a567-0e02b2c3d47X", null],
      ["f47ac10b", null],
      ["X", null],

      // Null handling
      ["", null],
    ])("$0 -> $1 $2", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "string" as const, format: "uuid" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").dtype).toEqual(DataType.Categorical)
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("categories", () => {
    it.each([
      // Flat categories
      ["apple", "apple", { categories: ["apple", "banana"] }],
      ["banana", "banana", { categories: ["apple", "banana"] }],
      ["mango", null, { categories: ["apple", "banana"] }],

      // Object categories
      ["apple", "apple", { categories: [{ value: "apple", label: "Apple" }] }],
      ["mango", null, { categories: [{ value: "apple", label: "Apple" }] }],
    ])("$0 -> $1 $2", async (cell, value, options) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [{ name: "name", type: "string" as const, ...options }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").dtype).toEqual(DataType.Categorical)
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })
})
