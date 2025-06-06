import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import type { Dialect } from "./Dialect.js"
import { saveDialect } from "./save.js"

describe("saveDialect", () => {
  const testDialect: Dialect = {
    delimiter: ";",
    header: true,
    quoteChar: '"',
    doubleQuote: true,
  }

  let testDir: string
  let testPath: string

  beforeEach(() => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "dialect.json")
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      if (error instanceof Error && !error.message.includes("ENOENT")) {
        console.error(`Failed to clean up test directory: ${testDir}`, error)
      }
    }
  })

  it("should save a dialect to a file and maintain its structure", async () => {
    await saveDialect(testDialect, { path: testPath })

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)

    // Remove $schema property for test comparison
    const { $schema, ...dialectWithoutSchema } = parsedContent
    expect(dialectWithoutSchema).toEqual(testDialect)
    expect($schema).toBe(
      "https://datapackage.org/profiles/2.0/tabledialect.json",
    )

    // Create expected format with $schema for comparison
    const expectedWithSchema = {
      ...testDialect,
      $schema: "https://datapackage.org/profiles/2.0/tabledialect.json",
    }
    // Verify the pretty formatting
    const expectedFormat = JSON.stringify(expectedWithSchema, null, 2)
    expect(content).toEqual(expectedFormat)
  })
})
