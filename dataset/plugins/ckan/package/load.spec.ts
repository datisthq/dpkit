import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
import { loadPackageFromCkan } from "./load.ts"

useRecording()

describe("loadPackageFromCkan", () => {
  it("should load a package", async () => {
    const dataPackage = await loadPackageFromCkan(
      "https://data.nhm.ac.uk/dataset/join-the-dots-collection-level-descriptions",
    )

    expect(dataPackage).toMatchSnapshot()
  })
})
