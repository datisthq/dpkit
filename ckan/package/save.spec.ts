import { loadPackage } from "@dpkit/core"
//import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { savePackageToCkan } from "./save.js"

describe("savePackageToCkan", () => {
  //useRecording()

  it.skip("should save a package", async () => {
    const datapackage = await loadPackage({
      path: "core/package/fixtures/package.json",
    })

    const result = await savePackageToCkan({
      datapackage,
      ckanUrl: "http://localhost:5000/",
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ1T0Y0VUNybTU5Y0dzdlk3ejhreF9CeC02R0w4RDBOdW9QS0J0WkJFXzlJIiwiaWF0IjoxNzQ3OTI0NDg5fQ.ioGiLlZkm24xHQRBas5X5ig5eU7u_fIjkl4oifGnLaA",
      datasetName: "test",
      ownerOrg: "test",
    })

    expect(result).toBeDefined()
    //expect(result).toMatchSnapshot()
  })
})
