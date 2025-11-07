import { render } from "ink-testing-library"
import * as pl from "nodejs-polars"
import React from "react"
import { describe, expect, it } from "vitest"
import { Table } from "./Table.tsx"

describe("Table", () => {
  it("should render basic table", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3],
        name: ["alice", "bob", "charlie"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("id")
    expect(output).toContain("name")
    expect(output).toContain("alice")
  })

  it("should render with custom schema", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        value: [100, 200],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "id", type: "integer" as const },
        { name: "value", type: "number" as const },
      ],
    }

    const { lastFrame } = render(<Table table={table} schema={schema} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("id")
    expect(output).toContain("value")
  })

  it("should render with green border by default", async () => {
    const table = pl
      .DataFrame({
        id: [1],
        name: ["alice"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(lastFrame()).toBeDefined()
  })

  it("should render with red border when specified", async () => {
    const table = pl
      .DataFrame({
        id: [1],
        name: ["alice"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} borderColor="red" />)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(lastFrame()).toBeDefined()
  })

  it("should render with types when withTypes is true", async () => {
    const table = pl
      .DataFrame({
        id: [1],
        name: ["alice"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} withTypes />)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(lastFrame()).toBeDefined()
  })

  it("should display help text by default", async () => {
    const table = pl
      .DataFrame({
        id: [1],
        name: ["alice"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("page")
    expect(output).toContain("to toggle docs")
    expect(output).toContain("to quit")
  })

  it("should display page number", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3],
        name: ["alice", "bob", "charlie"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("page")
    expect(output).toContain("1")
  })

  it("should render multiple rows", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 4],
        name: ["alice", "bob", "charlie", "dave"],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("alice")
    expect(output).toContain("bob")
    expect(output).toContain("charlie")
  })

  it("should render with numeric values", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        value: [100.5, 200.75],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("100.5")
    expect(output).toContain("200.75")
  })

  it("should render with boolean values", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        active: [true, false],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("true")
    expect(output).toContain("false")
  })

  it("should handle empty table", async () => {
    const table = pl
      .DataFrame({
        id: [],
        name: [],
      })
      .lazy()

    const { lastFrame } = render(<Table table={table} />)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(lastFrame()).toBeDefined()
  })
})
