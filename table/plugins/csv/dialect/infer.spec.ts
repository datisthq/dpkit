import { writeTempFile } from "@dpkit/dataset"
import { describe, expect, it } from "vitest"
import { inferCsvDialect } from "./infer.ts"

describe("inferCsvDialect", () => {
  it("should infer a simple CSV file", async () => {
    const path = await writeTempFile("id,name\n1,english\n2,中文")
    const dialect = await inferCsvDialect({ path })

    expect(dialect).toEqual({
      delimiter: ",",
    })
  })

  it("should infer quoteChar", async () => {
    const path = await writeTempFile('id,name\n1,"John Doe"\n2,"Jane Smith"')
    const dialect = await inferCsvDialect({ path })

    expect(dialect).toEqual({
      delimiter: ",",
      quoteChar: '"',
    })
  })

  it("should infer quoteChar with single quotes", async () => {
    const path = await writeTempFile("id,name\n1,'John Doe'\n2,'Jane Smith'")
    const dialect = await inferCsvDialect({ path })

    expect(dialect).toEqual({
      delimiter: ",",
      quoteChar: "'",
    })
  })

  // TODO: it gives false positives
  it.skip("should infer header false when no header present", async () => {
    const path = await writeTempFile("1,english\n2,中文\n3,español")
    const dialect = await inferCsvDialect({ path })

    expect(dialect).toEqual({
      delimiter: ",",
      header: false,
    })
  })

  it("should not set header when header is present", async () => {
    const path = await writeTempFile("id,name\n1,english\n2,中文")
    const dialect = await inferCsvDialect({ path })

    expect(dialect).toEqual({
      delimiter: ",",
    })
  })

  // TODO: recover if possible with csv-sniffer
  it.skip("should infer complex CSV with quotes and header", async () => {
    const path = await writeTempFile(
      'name,description\n"Product A","A great product with, commas"\n"Product B","Another product"',
    )

    const dialect = await inferCsvDialect({ path })
    expect(dialect).toEqual({
      delimiter: ",",
      quoteChar: '"',
    })
  })
})
