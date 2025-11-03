import type { DataRecord } from "@dpkit/lib"
import { render } from "ink-testing-library"
import { describe, expect, it } from "vitest"
import { DataGrid } from "./DataGrid.tsx"

describe("DataGrid", () => {
  it("should render empty grid with no records", () => {
    const records: DataRecord[] = []
    const { lastFrame } = render(<DataGrid records={records} />)

    expect(lastFrame()).toBeDefined()
  })

  it("should render basic data grid", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(<DataGrid records={records} />)

    const output = lastFrame()
    expect(output).toContain("id")
    expect(output).toContain("name")
    expect(output).toContain("alice")
    expect(output).toContain("bob")
  })

  it("should render with custom schema", () => {
    const records: DataRecord[] = [
      { id: 1, value: 100 },
      { id: 2, value: 200 },
    ]
    const schema = {
      fields: [
        { name: "id", type: "integer" as const },
        { name: "value", type: "number" as const },
      ],
    }
    const { lastFrame } = render(<DataGrid records={records} schema={schema} />)

    const output = lastFrame()
    expect(output).toContain("id")
    expect(output).toContain("value")
  })

  it("should render with types when withTypes is true", () => {
    const records: DataRecord[] = [{ id: 1, name: "alice" }]
    const { lastFrame } = render(<DataGrid records={records} withTypes />)

    const output = lastFrame()
    expect(output).toBeDefined()
    expect(output).toContain("id")
    expect(output).toContain("name")
  })

  it("should render with column selection", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(<DataGrid records={records} col={1} />)

    const output = lastFrame()
    expect(output).toContain("id")
    expect(output).toContain("name")
  })

  it("should render with row selection", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(<DataGrid records={records} row={1} />)

    const output = lastFrame()
    expect(output).toContain("alice")
    expect(output).toContain("bob")
  })

  it("should render with both row and column selection", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(<DataGrid records={records} col={1} row={1} />)

    const output = lastFrame()
    expect(output).toContain("alice")
    expect(output).toContain("bob")
  })

  it("should render with ascending order indicator", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(
      <DataGrid records={records} order={{ col: 1, dir: "asc" }} />,
    )

    const output = lastFrame()
    expect(output).toContain("▲")
  })

  it("should render with descending order indicator", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ]
    const { lastFrame } = render(
      <DataGrid records={records} order={{ col: 1, dir: "desc" }} />,
    )

    const output = lastFrame()
    expect(output).toContain("▼")
  })

  it("should render with green border by default", () => {
    const records: DataRecord[] = [{ id: 1, name: "alice" }]
    const { lastFrame } = render(<DataGrid records={records} />)

    expect(lastFrame()).toBeDefined()
  })

  it("should render with red border when specified", () => {
    const records: DataRecord[] = [{ id: 1, name: "alice" }]
    const { lastFrame } = render(
      <DataGrid records={records} borderColor="red" />,
    )

    expect(lastFrame()).toBeDefined()
  })

  it("should render multiple rows correctly", () => {
    const records: DataRecord[] = [
      { id: 1, name: "alice", age: 30 },
      { id: 2, name: "bob", age: 25 },
      { id: 3, name: "charlie", age: 35 },
    ]
    const { lastFrame } = render(<DataGrid records={records} />)

    const output = lastFrame()
    expect(output).toContain("alice")
    expect(output).toContain("bob")
    expect(output).toContain("charlie")
    expect(output).toContain("30")
    expect(output).toContain("25")
    expect(output).toContain("35")
  })

  it("should handle numeric values", () => {
    const records: DataRecord[] = [
      { id: 1, value: 100.5 },
      { id: 2, value: 200.75 },
    ]
    const { lastFrame } = render(<DataGrid records={records} />)

    const output = lastFrame()
    expect(output).toContain("100.5")
    expect(output).toContain("200.75")
  })

  it("should handle boolean values", () => {
    const records: DataRecord[] = [
      { id: 1, active: true },
      { id: 2, active: false },
    ]
    const { lastFrame } = render(<DataGrid records={records} />)

    const output = lastFrame()
    expect(output).toContain("true")
    expect(output).toContain("false")
  })
})
