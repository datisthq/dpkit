import { join } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Package } from "./Package.js"
import { loadPackage } from "./load.js"

describe("loadPackage", async () => {
  const getFixturePath = (name: string) => join(__dirname, "fixtures", name)

  it("loads a package from a local file path", async () => {
    const pkg = await loadPackage({ path: getFixturePath("package.json") })
    expectTypeOf(pkg).toEqualTypeOf<Package>()
    // Check for some expected properties from the fixture
    expect(pkg.name).toBe("name")
    expect(pkg.resources.length).toBeGreaterThan(0)
  })

  it("throws an error when package is invalid", async () => {
    await expect(
      loadPackage({ path: getFixturePath("package-invalid.json") }),
    ).rejects.toThrow()
  })
})
