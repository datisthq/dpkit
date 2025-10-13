import { describe, expect, it } from "vitest"
import { getRecordsFromRows } from "./record.ts"

describe("getRecordsFromRows", () => {
  it("should convert rows to records with default header", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should handle single row with header", () => {
    const rows = [["name", "age", "city"]]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([])
  })

  it("should handle empty rows", () => {
    const rows: unknown[][] = []

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([])
  })

  it("should handle rows without header when header is false", () => {
    const rows = [
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, { header: false })

    expect(result).toEqual([
      { field1: "Alice", field2: 30, field3: "NYC" },
      { field1: "Bob", field2: 25, field3: "LA" },
    ])
  })

  it("should handle custom header rows", () => {
    const rows = [
      ["skip this row"],
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, { headerRows: [2] })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should handle multiple header rows with default join", () => {
    const rows = [
      ["first", "last", "contact"],
      ["name", "name", "email"],
      ["Alice", "Smith", "alice@example.com"],
      ["Bob", "Jones", "bob@example.com"],
    ]

    const result = getRecordsFromRows(rows, { headerRows: [1, 2] })

    expect(result).toEqual([
      {
        "first name": "Alice",
        "last name": "Smith",
        "contact email": "alice@example.com",
      },
      {
        "first name": "Bob",
        "last name": "Jones",
        "contact email": "bob@example.com",
      },
    ])
  })

  it("should handle multiple header rows with custom join", () => {
    const rows = [
      ["user", "user", "meta"],
      ["first", "last", "created"],
      ["Alice", "Smith", "2023-01-01"],
      ["Bob", "Jones", "2023-01-02"],
    ]

    const result = getRecordsFromRows(rows, {
      headerRows: [1, 2],
      headerJoin: "_",
    })

    expect(result).toEqual([
      { user_first: "Alice", user_last: "Smith", meta_created: "2023-01-01" },
      { user_first: "Bob", user_last: "Jones", meta_created: "2023-01-02" },
    ])
  })

  it("should skip comment rows by row number", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      ["# Comment row", "ignored", "data"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, { commentRows: [3] })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should skip rows with comment character", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      ["# Comment", "ignored", "data"],
      ["Bob", 25, "LA"],
      ["Regular row", "data", "value"],
    ]

    const result = getRecordsFromRows(rows, { commentChar: "#" })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
      { name: "Regular row", age: "data", city: "value" },
    ])
  })

  it("should skip rows with multiple comment characters", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      ["# Comment 1", "ignored", "data"],
      ["Bob", 25, "LA"],
      ["## Comment 2", "ignored", "data"],
    ]

    const result = getRecordsFromRows(rows, { commentChar: "#" })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should not skip rows when first cell is not string", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", 30, "NYC"],
      [123, "data", "test"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, { commentChar: "#" })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: 123, age: "data", city: "test" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should handle rows with different lengths", () => {
    const rows = [
      ["name", "age", "city", "country"],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA", "USA"],
      ["Charlie"],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC", country: undefined },
      { name: "Bob", age: 25, city: "LA", country: "USA" },
      {
        name: "Charlie",
        age: undefined,
        city: undefined,
        country: undefined,
      },
    ])
  })

  it("should handle null and undefined values", () => {
    const rows = [
      ["name", "age", "city"],
      ["Alice", null, undefined],
      [null, 25, "LA"],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { name: "Alice", age: null, city: undefined },
      { name: null, age: 25, city: "LA" },
    ])
  })

  it("should handle boolean and number types", () => {
    const rows = [
      ["name", "active", "count"],
      ["Alice", true, 100],
      ["Bob", false, 0],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { name: "Alice", active: true, count: 100 },
      { name: "Bob", active: false, count: 0 },
    ])
  })

  it("should convert header values to strings", () => {
    const rows = [
      [1, 2, 3],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { "1": "Alice", "2": 30, "3": "NYC" },
      { "1": "Bob", "2": 25, "3": "LA" },
    ])
  })

  it("should handle empty header cells", () => {
    const rows = [
      ["name", "", "city"],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows)

    expect(result).toEqual([
      { name: "Alice", "": 30, city: "NYC" },
      { name: "Bob", "": 25, city: "LA" },
    ])
  })

  it("should handle multi-row headers with empty cells", () => {
    const rows = [
      ["person", "", "location"],
      ["first", "last", "city"],
      ["Alice", "Smith", "NYC"],
    ]

    const result = getRecordsFromRows(rows, { headerRows: [1, 2] })

    expect(result).toEqual([
      { "person first": "Alice", last: "Smith", "location city": "NYC" },
    ])
  })

  it("should handle combination of headerRows and commentRows", () => {
    const rows = [
      ["skip row 1"],
      ["name", "age", "city"],
      ["# Comment", "data", "data"],
      ["Alice", 30, "NYC"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, {
      headerRows: [2],
      commentRows: [3],
    })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should handle combination of commentRows and commentChar", () => {
    const rows = [
      ["name", "age", "city"],
      ["# Inline comment", "data", "data"],
      ["Alice", 30, "NYC"],
      ["Comment by row number", "data", "data"],
      ["Bob", 25, "LA"],
    ]

    const result = getRecordsFromRows(rows, {
      commentRows: [4],
      commentChar: "#",
    })

    expect(result).toEqual([
      { name: "Alice", age: 30, city: "NYC" },
      { name: "Bob", age: 25, city: "LA" },
    ])
  })

  it("should generate field names based on longest row when no header", () => {
    const rows = [
      ["Alice", 30],
      ["Bob", 25, "LA", "USA"],
      ["Charlie", 35, "SF"],
    ]

    const result = getRecordsFromRows(rows, { header: false })

    expect(result).toEqual([
      { field1: "Alice", field2: 30, field3: undefined, field4: undefined },
      { field1: "Bob", field2: 25, field3: "LA", field4: "USA" },
      { field1: "Charlie", field2: 35, field3: "SF", field4: undefined },
    ])
  })
})
