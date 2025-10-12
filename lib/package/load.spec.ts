import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { loadPackage } from "./load.ts"

describe("loadPackage", () => {
  it("should load package from JSON file", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

    const dataPackage = await loadPackage(packagePath)

    expect(dataPackage).toBeDefined()
    expect(dataPackage.name).toBe("test-package")
    expect(dataPackage.resources).toBeDefined()
    expect(dataPackage.resources.length).toBe(1)
  })

  it("should load package with multiple resources", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          path: csvPath,
          format: "csv",
        },
        {
          name: "resource-2",
          data: [{ id: 1, value: 100 }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

    const dataPackage = await loadPackage(packagePath)

    expect(dataPackage).toBeDefined()
    expect(dataPackage.name).toBe("test-package")
    expect(dataPackage.resources.length).toBe(2)
  })

  it("should load package with metadata", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      title: "Test Package",
      description: "A test data package",
      version: "1.0.0",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

    const dataPackage = await loadPackage(packagePath)

    expect(dataPackage.name).toBe("test-package")
    expect(dataPackage.title).toBe("Test Package")
    expect(dataPackage.description).toBe("A test data package")
    expect(dataPackage.version).toBe("1.0.0")
  })

  it("should load package with inline data resources", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [
            { id: 1, name: "alice" },
            { id: 2, name: "bob" },
          ],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

    const dataPackage = await loadPackage(packagePath)

    expect(dataPackage).toBeDefined()
    expect(dataPackage.resources?.[0]?.data).toBeDefined()
  })

  it("should load package with schema", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
          schema: {
            fields: [
              { name: "id", type: "integer" },
              { name: "name", type: "string" },
            ],
          },
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)

    const dataPackage = await loadPackage(packagePath)

    expect(dataPackage.resources?.[0]?.schema).toBeDefined()
    expect(
      typeof dataPackage.resources?.[0]?.schema === "object" &&
        "fields" in dataPackage.resources[0].schema &&
        dataPackage.resources[0].schema.fields?.length,
    ).toBe(2)
  })
})
