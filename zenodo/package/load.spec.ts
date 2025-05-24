import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromZenodo } from "./load.js"

describe("loadPackageFromZenodo", () => {
  useRecording()

  it("should load a package", async () => {
    const datapackage = await loadPackageFromZenodo({
      datasetUrl: "https://sandbox.zenodo.org/records/260528",
    })

    expect(datapackage).toMatchSnapshot()
  })
})
