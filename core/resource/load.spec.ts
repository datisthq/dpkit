import { join, relative } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Resource } from "./Resource.js"
import { loadResourceDescriptor } from "./load.js"

describe("loadResourceDescriptor", async () => {
  const getFixturePath = (name: string) =>
    relative(process.cwd(), join(__dirname, "fixtures", name))

  const descriptor = {
    name: "name",
    path: "table.csv",
  }

  it("loads a resource from a local file path", async () => {
    const resource = await loadResourceDescriptor({
      path: getFixturePath("resource.json"),
    })

    expectTypeOf(resource).toEqualTypeOf<Resource>()
    expect(resource).toEqual({
      ...descriptor,
      path: getFixturePath("table.csv"),
    })
  })

  it("throws an error when resource is invalid", async () => {
    await expect(
      loadResourceDescriptor({ path: getFixturePath("resource-invalid.json") }),
    ).rejects.toThrow()
  })
})
