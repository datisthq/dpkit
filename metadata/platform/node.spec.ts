import { describe, expect, it } from "vitest"
import { node } from "./node.ts"

describe("loadNodeApis", () => {
  it("should return node APIs when running in Node.js environment", async () => {
    expect(node).toBeDefined()
    expect(node?.fs).toBeDefined()
    expect(node?.path).toBeDefined()
  })

  it("should have fs.readFile function", async () => {
    expect(typeof node?.fs.readFile).toBe("function")
  })

  it("should have path.join function", async () => {
    expect(typeof node?.path.join).toBe("function")
  })
})
