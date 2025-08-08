import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromDatahub } from "./load.ts"

describe.skip("loadPackageFromDatahub", () => {
  useRecording()

  it("should load a package", async () => {
    const dataPackage = await loadPackageFromDatahub(
      "https://datahub.io/core/eu-emissions-trading-system#readme",
    )

    expect(dataPackage).toMatchSnapshot()
  })
})
