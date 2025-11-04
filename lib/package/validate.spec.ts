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

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
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

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
    expect(report.errors?.[0]?.resource).toBe("test-resource")
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

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
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

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(1)
    expect(report.errors.some(e => e.resource === "resource-1")).toBe(true)
    expect(report.errors.some(e => e.resource === "resource-2")).toBe(true)
  })

  it("should reject package with no resources", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [],
    }

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)
    const firstError = report.errors?.[0]
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

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(false)
    report.errors.forEach(error => {
      expect(error.resource).toBe("error-resource")
    })
  })

  it("should detect bad cell type (issue-153)", async () => {
    const dataPackage = "lib/package/fixtures/issue-153/datapackage.json"

    const report = await validatePackage(dataPackage)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        rowNumber: 3,
        type: "cell/type",
        fieldName: "longitude",
        fieldType: "number",
        cell: "bad",
        resource: "deployments",
      },
    ])
  })
})
