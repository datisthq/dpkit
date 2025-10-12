import { describe, expect, it } from "vitest"
import { validatePackage } from "./validate.ts"

describe("validatePackage", () => {
  it("should validate a valid package with inline data", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          type: "table" as const,
          data: [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
          ],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
      ],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("should detect invalid resource data", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          type: "table" as const,
          data: [
            { id: 1, name: "Alice" },
            { id: "not-a-number", name: "Bob" },
          ],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
      ],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors?.[0]?.resource).toBe("test-resource")
  })

  it("should validate multiple resources", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          type: "table" as const,
          data: [{ id: 1, name: "Alice" }],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
        {
          name: "resource-2",
          type: "table" as const,
          data: [{ id: 2, value: 100 }],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "value", type: "number" as const },
            ],
          },
        },
      ],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("should detect errors in multiple resources", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          type: "table" as const,
          data: [{ id: "invalid", name: "Alice" }],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
        {
          name: "resource-2",
          type: "table" as const,
          data: [{ id: 2, value: "invalid" }],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "value", type: "number" as const },
            ],
          },
        },
      ],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
    expect(result.errors.some(e => e.resource === "resource-1")).toBe(true)
    expect(result.errors.some(e => e.resource === "resource-2")).toBe(true)
  })

  it("should reject package with no resources", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    const firstError = result.errors?.[0]
    if (firstError && "message" in firstError) {
      expect(firstError.message).toContain("must NOT have fewer than 1 items")
    }
  })

  it("should tag errors with resource name", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "error-resource",
          type: "table" as const,
          data: [{ id: "invalid", name: 123 }],
          schema: {
            fields: [
              { name: "id", type: "number" as const },
              { name: "name", type: "string" as const },
            ],
          },
        },
      ],
    }

    const result = await validatePackage(dataPackage)

    expect(result.valid).toBe(false)
    result.errors.forEach(error => {
      expect(error.resource).toBe("error-resource")
    })
  })
})
