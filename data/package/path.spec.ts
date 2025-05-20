import { describe, expect, it } from "vitest"
import { getCommonLocalBasepath } from "./path.js"

describe("getCommonLocalBasepath", () => {
  it("should work", () => {
    const basepath = getCommonLocalBasepath({
      paths: ["data/table1.csv", "data/table2.csv"],
    })
  })
})
