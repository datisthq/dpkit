import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
import { loadPackageFromGithub } from "./load.ts"

useRecording()

describe("loadPackageFromGithub", () => {
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
