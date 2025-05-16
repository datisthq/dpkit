import { join } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Package } from "./Package.js"
import { loadPackage } from "./load.js"

describe("loadPackage", async () => {
  const getFixturePath = (name: string) => join(__dirname, "fixtures", name)

  it("loads a package from a local file path", async () => {
    const datapack = await loadPackage({ path: getFixturePath("package.json") })

    expectTypeOf(datapack).toEqualTypeOf<Package>()
    expect(datapack.name).toBe("name")
    expect(datapack.resources.length).toBeGreaterThan(0)

    const resource = datapack.resources[0]
    expect(resource).toBeDefined()

    if (resource) {
      expect(resource).toEqual({
        type: "table",
        name: "name",
        path: getFixturePath("table.csv"),
        dialect: getFixturePath("dialect.json"),
        schema: getFixturePath("schema.json"),
      })
    }
  })

  it("throws an error when package is invalid", async () => {
    await expect(
      loadPackage({ path: getFixturePath("package-invalid.json") }),
    ).rejects.toThrow()
  })
})
