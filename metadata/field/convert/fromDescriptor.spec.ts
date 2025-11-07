import { describe, expect, it, vi } from "vitest"
import { convertFieldFromDescriptor } from "./fromDescriptor.ts"

describe("convertFieldFromDescriptor", () => {
  it("should return a cloned descriptor", () => {
    const descriptor = { name: "id", type: "string" }

    const result = convertFieldFromDescriptor(descriptor)

    expect(result).toEqual(descriptor)
    expect(result).not.toBe(descriptor)
  })

  describe("format conversion", () => {
    it("should remove fmt: prefix from format", () => {
      const descriptor = { name: "id", type: "string", format: "fmt:email" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.format).toBe("email")
    })

    it("should preserve format without fmt: prefix", () => {
      const descriptor = { name: "id", type: "string", format: "email" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.format).toBe("email")
    })

    it("should handle descriptor without format", () => {
      const descriptor = { name: "id", type: "string" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.format).toBeUndefined()
    })
  })

  describe("missingValues validation", () => {
    it("should preserve valid missingValues array", () => {
      const descriptor = {
        name: "id",
        type: "string",
        missingValues: ["", "NA", "N/A"],
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.missingValues).toEqual(["", "NA", "N/A"])
    })

    it("should remove invalid non-array missingValues and warn", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "id",
        type: "string",
        missingValues: "invalid",
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.missingValues).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Ignoring v2.0 incompatible missingValues: invalid",
      )
      consoleWarnSpy.mockRestore()
    })

    it("should handle descriptor without missingValues", () => {
      const descriptor = { name: "id", type: "string" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.missingValues).toBeUndefined()
    })
  })

  describe("categories validation", () => {
    it("should preserve valid categories array", () => {
      const descriptor = {
        name: "status",
        type: "string",
        categories: ["active", "inactive", "pending"],
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categories).toEqual(["active", "inactive", "pending"])
    })

    it("should remove invalid non-array categories and warn", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "status",
        type: "string",
        categories: "invalid",
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categories).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Ignoring v2.0 incompatible categories: invalid",
      )
      consoleWarnSpy.mockRestore()
    })

    it("should handle descriptor without categories", () => {
      const descriptor = { name: "status", type: "string" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categories).toBeUndefined()
    })
  })

  describe("categoriesOrdered validation", () => {
    it("should preserve valid categoriesOrdered boolean", () => {
      const descriptor = {
        name: "status",
        type: "string",
        categoriesOrdered: true,
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categoriesOrdered).toBe(true)
    })

    it("should remove invalid non-boolean categoriesOrdered and warn", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "status",
        type: "string",
        categoriesOrdered: "invalid",
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categoriesOrdered).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Ignoring v2.0 incompatible categoriesOrdered: invalid",
      )
      consoleWarnSpy.mockRestore()
    })

    it("should handle descriptor without categoriesOrdered", () => {
      const descriptor = { name: "status", type: "string" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.categoriesOrdered).toBeUndefined()
    })
  })

  describe("jsonschema validation", () => {
    it("should preserve valid jsonschema object", () => {
      const descriptor = {
        name: "data",
        type: "object",
        jsonschema: { type: "object", properties: { id: { type: "number" } } },
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.jsonschema).toEqual({
        type: "object",
        properties: { id: { type: "number" } },
      })
    })

    it("should remove invalid non-object jsonschema and warn", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "data",
        type: "object",
        jsonschema: "invalid",
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.jsonschema).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Ignoring v2.0 incompatible jsonschema: invalid",
      )
      consoleWarnSpy.mockRestore()
    })

    it("should handle descriptor without jsonschema", () => {
      const descriptor = { name: "data", type: "object" }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.jsonschema).toBeUndefined()
    })
  })

  describe("combined conversions", () => {
    it("should apply all conversions together", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "email",
        type: "string",
        format: "fmt:email",
        missingValues: ["", "NA"],
        categories: ["valid", "invalid"],
        categoriesOrdered: true,
        jsonschema: { type: "string", pattern: "^[a-z]+@[a-z]+\\.[a-z]+$" },
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.format).toBe("email")
      expect(result.missingValues).toEqual(["", "NA"])
      expect(result.categories).toEqual(["valid", "invalid"])
      expect(result.categoriesOrdered).toBe(true)
      expect(result.jsonschema).toEqual({
        type: "string",
        pattern: "^[a-z]+@[a-z]+\\.[a-z]+$",
      })
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it("should handle multiple invalid properties and warn for each", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {})
      const descriptor = {
        name: "field",
        type: "string",
        missingValues: "invalid",
        categories: 123,
        categoriesOrdered: "invalid",
        jsonschema: "invalid",
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.missingValues).toBeUndefined()
      expect(result.categories).toBeUndefined()
      expect(result.categoriesOrdered).toBeUndefined()
      expect(result.jsonschema).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalledTimes(4)
      consoleWarnSpy.mockRestore()
    })

    it("should handle field with all valid properties", () => {
      const descriptor = {
        name: "age",
        type: "integer",
        title: "Age",
        description: "Person's age",
        format: "fmt:default",
        example: 25,
        examples: [18, 25, 30, 45],
        rdfType: "http://schema.org/age",
        missingValues: ["", "unknown"],
        categories: ["young", "middle", "old"],
        categoriesOrdered: true,
        jsonschema: { type: "integer", minimum: 0, maximum: 150 },
        constraints: {
          required: true,
          minimum: 0,
          maximum: 150,
        },
      }

      const result = convertFieldFromDescriptor(descriptor)

      expect(result.name).toBe("age")
      expect(result.type).toBe("integer")
      expect(result.title).toBe("Age")
      expect(result.description).toBe("Person's age")
      expect(result.format).toBe("default")
      expect(result.example).toBe(25)
      expect(result.examples).toEqual([18, 25, 30, 45])
      expect(result.rdfType).toBe("http://schema.org/age")
      expect(result.missingValues).toEqual(["", "unknown"])
      expect(result.categories).toEqual(["young", "middle", "old"])
      expect(result.categoriesOrdered).toBe(true)
      expect(result.jsonschema).toEqual({
        type: "integer",
        minimum: 0,
        maximum: 150,
      })
      expect(result.constraints).toEqual({
        required: true,
        minimum: 0,
        maximum: 150,
      })
    })
  })
})
