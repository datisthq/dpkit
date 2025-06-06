import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromZenodo } from "./load.js"

describe("loadPackageFromZenodo", () => {
  useRecording()

  it("should load a package", async () => {
    const datapackage = await loadPackageFromZenodo(
      "https://zenodo.org/records/15525711",
    )

    expect(datapackage).toMatchSnapshot()
  })

  it("shoule merge datapackage.json if present", async () => {
    const datapackage = await loadPackageFromZenodo(
      "https://zenodo.org/records/10053903",
    )

    expect(datapackage).toMatchSnapshot()
  })
})
