import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
import { loadPackageFromDatahub } from "./load.ts"

useRecording()

describe.skip("loadPackageFromDatahub", () => {
  it("should load a package", async () => {
    const dataPackage = await loadPackageFromDatahub(
      "https://datahub.io/core/eu-emissions-trading-system#readme",
    )

    expect(dataPackage).toMatchSnapshot()
  })
})
