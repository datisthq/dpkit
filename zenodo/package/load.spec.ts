import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromZenodo } from "./load.js"

describe("loadPackageFromZenodo", () => {
  useRecording()

  it("should load a package", async () => {
    const datapackage = await loadPackageFromZenodo({
      datasetUrl: "https://zenodo.org/records/15496947",
    })

    expect(datapackage).toMatchSnapshot()
  })
})
