import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromGithub } from "./load.js"

describe("loadPackageFromGithub", () => {
  useRecording()

  // TODO: add a test without user package merging
  // TODO: fix remote paths normalization
  it.skip("should load a package", async () => {
    const datapackage = await loadPackageFromGithub({
      repoUrl: "https://github.com/roll/currency-codes",
    })

    expect(datapackage).toMatchSnapshot()
  })
})
