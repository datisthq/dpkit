import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import type { Schema } from "./Schema.ts"
import { saveSchema } from "./save.ts"

describe("saveSchema", () => {
  const testSchema: Schema = {
    fields: [
      {
        name: "id",
        type: "integer",
      },
      {
        name: "name",
        type: "string",
      },
    ],
    primaryKey: ["id"],
  }

  let testDir: string
  let testPath: string

  beforeEach(() => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "schema.json")
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

  it("should save a schema to a file and maintain its structure", async () => {
    await saveSchema(testSchema, { path: testPath })

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)

    // Remove $schema property for test comparison
    const { $schema, ...schemaWithoutSchema } = parsedContent
    expect(schemaWithoutSchema).toEqual(testSchema)
    expect($schema).toBe(
      "https://datapackage.org/profiles/2.0/tableschema.json",
    )

    // Create expected format with $schema for comparison
    const expectedWithSchema = {
      ...testSchema,
      $schema: "https://datapackage.org/profiles/2.0/tableschema.json",
    }
    const expectedFormat = JSON.stringify(expectedWithSchema, null, 2)
    expect(content).toEqual(expectedFormat)
  })
})
