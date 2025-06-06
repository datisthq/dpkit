import { loadPackageDescriptor } from "@dpkit/core"
//import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { savePackageToZenodo } from "./save.js"

describe("savePackageToZenodo", () => {
  //useRecording()

  it.skip("should save a package", async () => {
    const dataPackage = await loadPackageDescriptor(
      "core/package/fixtures/package.json",
    )

    const result = await savePackageToZenodo(dataPackage, {
      apiKey: "<key>",
      sandbox: true,
    })

    expect(result).toBeDefined()
    //expect(result).toMatchSnapshot()
  })
})
