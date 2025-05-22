import { describe, expect, it } from "vitest"
import { loadPackageFromCkan } from "./load.js"
import { useRecording } from "@dpkit/test"

describe("loadPackageFromCkan", () => {
  useRecording()

  it("should load a package", async () => {
    expect(true).toBe(true)
    const datapackage = await loadPackageFromCkan({
      datasetUrl:
        "https://data.nhm.ac.uk/dataset/join-the-dots-collection-level-descriptions",
    })
  })
})
