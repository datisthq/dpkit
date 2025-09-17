import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "./validate.ts"

describe("validateTable", () => {
  describe("fields validation with fieldsMatch='exact'", () => {
    it("should pass when fields exactly match", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
      }).lazy()

      const schema: Schema = {
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })

      expect(errors).toEqual([])
    })

    it("should not have fields error when fields same length", async () => {
      const table = DataFrame({
        id: [1, 2],
        age: [30, 25],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "exact",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "number" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([
        {
          type: "field/name",
          fieldName: "name",
          actualFieldName: "age",
        },
      ])
    })
  })

  it("should detect extra fields", async () => {
    const table = DataFrame({
      id: [1, 2],
      name: ["John", "Jane"],
      age: [30, 25],
    }).lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toContainEqual({
      type: "fields/extra",
      fieldNames: ["age"],
    })
  })

  it("should detect missing fields", async () => {
    const table = DataFrame({
      id: [1, 2],
    }).lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toContainEqual({
      type: "fields/missing",
      fieldNames: ["name"],
    })
  })

  describe("fields validation with fieldsMatch='equal'", () => {
    it("should pass when field names match regardless of order", async () => {
      const table = DataFrame({
        name: ["John", "Jane"],
        id: [1, 2],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "equal",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should detect extra fields", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
        age: [30, 25],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "equal",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toContainEqual({
        type: "fields/extra",
        fieldNames: ["age"],
      })
    })

    it("should detect missing fields", async () => {
      const table = DataFrame({
        id: [1, 2],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "equal",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toContainEqual({
        type: "fields/missing",
        fieldNames: ["name"],
      })
    })
  })

  describe("fields validation with fieldsMatch='subset'", () => {
    it("should pass when data contains all schema fields", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
        age: [30, 25],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "subset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should pass when data contains exact schema fields", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "subset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should detect missing fields", async () => {
      const table = DataFrame({
        id: [1, 2],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "subset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toContainEqual({
        type: "fields/missing",
        fieldNames: ["name"],
      })
    })
  })

  describe("fields validation with fieldsMatch='superset'", () => {
    it("should pass when schema contains all data fields", async () => {
      const table = DataFrame({
        id: [1, 2],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "superset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should pass when schema contains exact data fields", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "superset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should detect extra fields", async () => {
      const table = DataFrame({
        id: [1, 2],
        name: ["John", "Jane"],
        age: [30, 25],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "superset",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toContainEqual({
        type: "fields/extra",
        fieldNames: ["age"],
      })
    })
  })

  describe("fields validation with fieldsMatch='partial'", () => {
    it("should pass when at least one field matches", async () => {
      const table = DataFrame({
        id: [1, 2],
        age: [30, 25],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "partial",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toEqual([])
    })

    it("should detect when no fields match", async () => {
      const table = DataFrame({
        age: [30, 25],
        email: ["john@example.com", "jane@example.com"],
      }).lazy()

      const schema: Schema = {
        fieldsMatch: "partial",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
        ],
      }

      const { errors } = await validateTable(table, { schema })
      expect(errors).toContainEqual({
        type: "fields/missing",
        fieldNames: ["id", "name"],
      })
    })
  })
})
