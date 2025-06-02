import { loadPackageDescriptor } from "@dpkit/core"
//import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { savePackageToGithub } from "./save.js"

describe("savePackageToGithub", () => {
  //useRecording()

  it.skip("should save a package", async () => {
    const dataPackage = await loadPackageDescriptor({
      path: "core/package/fixtures/package.json",
    })

    const result = await savePackageToGithub({
      dataPackage,
      apiKey: "<key>",
      repo: "test",
    })

    console.log(result)

    expect(true).toBeDefined()
    //expect(result).toMatchSnapshot()
  })
})
