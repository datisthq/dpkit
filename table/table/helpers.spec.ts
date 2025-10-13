import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import {
  joinHeaderRows,
  skipCommentRows,
  stripInitialSpace,
} from "./helpers.ts"

describe("joinHeaderRows", () => {
  it("should join two header rows with default space separator", async () => {
    const table = DataFrame({
      col1: ["first", "name", "header3", "Alice", "Bob"],
      col2: ["last", "name", "header3", "Smith", "Jones"],
      col3: [
        "contact",
        "email",
        "header3",
        "alice@example.com",
        "bob@example.com",
      ],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { headerRows: [2, 3] },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual([
      "col1 first",
      "col2 last",
      "col3 contact",
    ])
    expect(collected.height).toBe(4)
    expect(collected.row(0)).toEqual(["name", "name", "email"])
    expect(collected.row(1)).toEqual(["header3", "header3", "header3"])
    expect(collected.row(2)).toEqual(["Alice", "Smith", "alice@example.com"])
    expect(collected.row(3)).toEqual(["Bob", "Jones", "bob@example.com"])
  })

  it("should join two header rows with custom separator", async () => {
    const table = DataFrame({
      col1: ["user", "first", "header3", "Alice", "Bob"],
      col2: ["user", "last", "header3", "Smith", "Jones"],
      col3: ["meta", "created", "header3", "2023-01-01", "2023-01-02"],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { headerRows: [2, 3], headerJoin: "_" },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual(["col1_user", "col2_user", "col3_meta"])
    expect(collected.height).toBe(4)
    expect(collected.row(0)).toEqual(["first", "last", "created"])
    expect(collected.row(1)).toEqual(["header3", "header3", "header3"])
    expect(collected.row(2)).toEqual(["Alice", "Smith", "2023-01-01"])
    expect(collected.row(3)).toEqual(["Bob", "Jones", "2023-01-02"])
  })

  it("should return table unchanged when only one header row", async () => {
    const table = DataFrame({
      name: ["Alice", "Bob"],
      age: [30, 25],
      city: ["NYC", "LA"],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { headerRows: [1] },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual(["name", "age", "city"])
    expect(collected.height).toBe(2)
  })

  it("should return table unchanged when no header rows", async () => {
    const table = DataFrame({
      field1: ["Alice", "Bob"],
      field2: [30, 25],
      field3: ["NYC", "LA"],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { header: false },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual(["field1", "field2", "field3"])
    expect(collected.height).toBe(2)
  })

  it("should join three header rows", async () => {
    const table = DataFrame({
      col1: ["person", "user", "first", "header4", "Alice", "Bob"],
      col2: ["person", "user", "last", "header4", "Smith", "Jones"],
      col3: ["location", "address", "city", "header4", "NYC", "LA"],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { headerRows: [2, 3, 4] },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual([
      "col1 person user",
      "col2 person user",
      "col3 location address",
    ])
    expect(collected.height).toBe(4)
    expect(collected.row(0)).toEqual(["first", "last", "city"])
    expect(collected.row(1)).toEqual(["header4", "header4", "header4"])
    expect(collected.row(2)).toEqual(["Alice", "Smith", "NYC"])
    expect(collected.row(3)).toEqual(["Bob", "Jones", "LA"])
  })

  it("should handle empty strings in header rows", async () => {
    const table = DataFrame({
      col1: ["person", "", "header3", "Alice", "Bob"],
      col2: ["", "name", "header3", "Smith", "Jones"],
      col3: ["location", "city", "header3", "NYC", "LA"],
    }).lazy()

    const result = await joinHeaderRows(table, {
      dialect: { headerRows: [2, 3] },
    })

    const collected = await result.collect()
    expect(collected.columns).toEqual(["col1 person", "col2 ", "col3 location"])
    expect(collected.height).toBe(4)
    expect(collected.row(0)).toEqual(["", "name", "city"])
    expect(collected.row(1)).toEqual(["header3", "header3", "header3"])
    expect(collected.row(2)).toEqual(["Alice", "Smith", "NYC"])
    expect(collected.row(3)).toEqual(["Bob", "Jones", "LA"])
  })
})

describe("skipCommentRows", () => {
  it("should skip comment rows by row number", async () => {
    const table = DataFrame({
      name: ["Alice", "# Comment", "Bob", "Charlie"],
      age: [30, 0, 25, 35],
      city: ["NYC", "ignored", "LA", "SF"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { commentRows: [2], header: false },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(3)
    expect(collected.row(0)).toEqual(["Alice", 30, "NYC"])
    expect(collected.row(1)).toEqual(["Bob", 25, "LA"])
    expect(collected.row(2)).toEqual(["Charlie", 35, "SF"])
  })

  it("should skip multiple comment rows", async () => {
    const table = DataFrame({
      name: ["Alice", "# Comment 1", "Bob", "# Comment 2", "Charlie"],
      age: [30, 0, 25, 0, 35],
      city: ["NYC", "ignored", "LA", "ignored", "SF"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { commentRows: [2, 4], header: false },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(3)
    expect(collected.row(0)).toEqual(["Alice", 30, "NYC"])
    expect(collected.row(1)).toEqual(["Bob", 25, "LA"])
    expect(collected.row(2)).toEqual(["Charlie", 35, "SF"])
  })

  it("should return table unchanged when no commentRows specified", async () => {
    const table = DataFrame({
      name: ["Alice", "Bob", "Charlie"],
      age: [30, 25, 35],
      city: ["NYC", "LA", "SF"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: {},
    })

    const collected = await result.collect()
    expect(collected.height).toBe(3)
    expect(collected.columns).toEqual(["name", "age", "city"])
  })

  it("should skip rows after header when headerRows specified", async () => {
    const table = DataFrame({
      col1: ["name", "Alice", "# Comment", "Bob"],
      col2: ["age", "30", "-1", "25"],
      col3: ["city", "NYC", "ignored", "LA"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { headerRows: [2], commentRows: [5] },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(3)
    expect(collected.row(0)).toEqual(["name", "age", "city"])
    expect(collected.row(1)).toEqual(["Alice", "30", "NYC"])
    expect(collected.row(2)).toEqual(["Bob", "25", "LA"])
  })

  it("should handle commentRows at the beginning", async () => {
    const table = DataFrame({
      name: ["# Skip this", "Alice", "Bob"],
      age: [0, 30, 25],
      city: ["ignored", "NYC", "LA"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { commentRows: [1], header: false },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(2)
    expect(collected.row(0)).toEqual(["Alice", 30, "NYC"])
    expect(collected.row(1)).toEqual(["Bob", 25, "LA"])
  })

  it("should handle commentRows at the end", async () => {
    const table = DataFrame({
      name: ["Alice", "Bob", "# Footer comment"],
      age: [30, 25, 0],
      city: ["NYC", "LA", "ignored"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { commentRows: [3], header: false },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(2)
    expect(collected.row(0)).toEqual(["Alice", 30, "NYC"])
    expect(collected.row(1)).toEqual(["Bob", 25, "LA"])
  })

  it("should handle multiple header rows with commentRows", async () => {
    const table = DataFrame({
      col1: ["person", "first", "Alice", "# Comment", "Bob"],
      col2: ["person", "last", "Smith", "ignored", "Jones"],
      col3: ["location", "city", "NYC", "ignored", "LA"],
    }).lazy()

    const result = skipCommentRows(table, {
      dialect: { headerRows: [2, 3], commentRows: [7] },
    })

    const collected = await result.collect()
    expect(collected.height).toBe(4)
    expect(collected.row(0)).toEqual(["person", "person", "location"])
    expect(collected.row(1)).toEqual(["first", "last", "city"])
    expect(collected.row(2)).toEqual(["Alice", "Smith", "NYC"])
    expect(collected.row(3)).toEqual(["Bob", "Jones", "LA"])
  })
})

describe("stripInitialSpace", () => {
  it("should strip leading and trailing spaces from all columns", async () => {
    const table = DataFrame({
      name: [" Alice ", " Bob", "Charlie "],
      age: ["30", " 25 ", "35"],
      city: [" NYC", "LA ", " SF "],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: true },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual(["Alice", "30", "NYC"])
    expect(collected.row(1)).toEqual(["Bob", "25", "LA"])
    expect(collected.row(2)).toEqual(["Charlie", "35", "SF"])
  })

  it("should return table unchanged when skipInitialSpace is false", async () => {
    const table = DataFrame({
      name: [" Alice ", " Bob"],
      age: ["30", " 25 "],
      city: [" NYC", "LA "],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: false },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual([" Alice ", "30", " NYC"])
    expect(collected.row(1)).toEqual([" Bob", " 25 ", "LA "])
  })

  it("should return table unchanged when skipInitialSpace is not specified", async () => {
    const table = DataFrame({
      name: [" Alice ", " Bob"],
      age: ["30", " 25 "],
      city: [" NYC", "LA "],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: {},
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual([" Alice ", "30", " NYC"])
    expect(collected.row(1)).toEqual([" Bob", " 25 ", "LA "])
  })

  it("should handle strings with no spaces", async () => {
    const table = DataFrame({
      name: ["Alice", "Bob"],
      age: ["30", "25"],
      city: ["NYC", "LA"],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: true },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual(["Alice", "30", "NYC"])
    expect(collected.row(1)).toEqual(["Bob", "25", "LA"])
  })

  it("should handle empty strings", async () => {
    const table = DataFrame({
      name: ["Alice", ""],
      age: ["30", " "],
      city: ["", "LA"],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: true },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual(["Alice", "30", ""])
    expect(collected.row(1)).toEqual(["", "", "LA"])
  })

  it("should handle strings with multiple spaces", async () => {
    const table = DataFrame({
      name: ["  Alice  ", "   Bob"],
      age: ["30   ", "  25  "],
      city: ["  NYC  ", "   LA   "],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: true },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual(["Alice", "30", "NYC"])
    expect(collected.row(1)).toEqual(["Bob", "25", "LA"])
  })

  it("should handle tabs and other whitespace", async () => {
    const table = DataFrame({
      name: ["\tAlice\t", "\nBob"],
      age: ["30\n", "\t25\t"],
      city: ["\tNYC", "LA\n"],
    }).lazy()

    const result = stripInitialSpace(table, {
      dialect: { skipInitialSpace: true },
    })

    const collected = await result.collect()
    expect(collected.row(0)).toEqual(["Alice", "30", "NYC"])
    expect(collected.row(1)).toEqual(["Bob", "25", "LA"])
  })
})
