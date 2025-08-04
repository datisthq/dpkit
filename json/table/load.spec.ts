import { writeTempFile } from "@dpkit/file"
//import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadJsonTable } from "./load.js"

describe("loadJsonTable", () => {
  //useRecording()

  describe("file variations", () => {
    it("should load local file", async () => {
      const path = await writeTempFile(
        JSON.stringify([
          { id: 1, name: "english" },
          { id: 2, name: "中文" },
        ]),
      )

      const table = await loadJsonTable({ path })
      expect((await table.collect()).toRecords()).toEqual([
        //{ id: "1", name: "english" },
        //{ id: "2", name: "中文" },
      ])
    })
  })
})
