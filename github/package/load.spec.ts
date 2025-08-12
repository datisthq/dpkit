import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadPackageFromGithub } from "./load.ts"

describe("loadPackageFromGithub", () => {
  useRecording()

  it("should load a package", async () => {
    const datapackage = await loadPackageFromGithub(
      "https://github.com/roll/data",
    )

    expect(datapackage).toMatchSnapshot()
  })

  it("should merge datapackage.json if present", async () => {
    const datapackage = await loadPackageFromGithub(
      "https://github.com/roll/currency-codes",
    )

    expect(datapackage).toMatchSnapshot()
  })
})
