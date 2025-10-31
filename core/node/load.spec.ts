import { describe, expect, it } from "vitest"
import { loadNodeApis } from "./load.ts"

describe("loadNodeApis", () => {
  it("should return node APIs when running in Node.js environment", async () => {
    const result = await loadNodeApis()

    expect(result).toBeDefined()
    expect(result?.fs).toBeDefined()
    expect(result?.path).toBeDefined()
  })

  it("should have fs.readFile function", async () => {
    const result = await loadNodeApis()

    expect(typeof result?.fs.readFile).toBe("function")
  })

  it("should have path.join function", async () => {
    const result = await loadNodeApis()

    expect(typeof result?.path.join).toBe("function")
  })
})
