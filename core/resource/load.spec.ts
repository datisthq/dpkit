import { join, relative } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Resource } from "./Resource.ts"
import { loadResourceDescriptor } from "./load.ts"

describe("loadResourceDescriptor", async () => {
  const getFixturePath = (name: string) =>
    relative(process.cwd(), join(__dirname, "fixtures", name))

  const descriptor = {
    name: "name",
    path: "table.csv",
  }

  it("loads a resource from a local file path", async () => {
    const resource = await loadResourceDescriptor(
      getFixturePath("resource.json"),
    )

    expectTypeOf(resource).toEqualTypeOf<Resource>()
    expect(resource).toEqual({
      ...descriptor,
      path: getFixturePath("table.csv"),
    })
  })

  it("throws an error when resource is invalid", async () => {
    await expect(
      loadResourceDescriptor(getFixturePath("resource-invalid.json")),
    ).rejects.toThrow()
  })
})
