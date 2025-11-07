import { describe, expect, it } from "vitest"
import {
  createDialectFromOptions,
  createToDialectFromOptions,
} from "./dialect.ts"

describe("createDialectFromOptions", () => {
  it("should return undefined when no options are provided", () => {
    const result = createDialectFromOptions({})

    expect(result).toBeUndefined()
  })

  it("should create dialect with delimiter", () => {
    const result = createDialectFromOptions({ delimiter: "," })

    expect(result).toEqual({ delimiter: "," })
  })

  it("should create dialect with multiple options", () => {
    const result = createDialectFromOptions({
      delimiter: ",",
      quoteChar: '"',
      escapeChar: "\\",
    })

    expect(result).toEqual({
      delimiter: ",",
      quoteChar: '"',
      escapeChar: "\\",
    })
  })

  it("should set header to false when explicitly set", () => {
    const result = createDialectFromOptions({ header: false })

    expect(result).toEqual({ header: false })
  })

  it("should not set header when true", () => {
    const result = createDialectFromOptions({ header: true })

    expect(result).toBeUndefined()
  })

  it("should parse headerRows from comma-separated string", () => {
    const result = createDialectFromOptions({ headerRows: "0,1,2" })

    expect(result).toEqual({ headerRows: [0, 1, 2] })
  })

  it("should set headerJoin", () => {
    const result = createDialectFromOptions({ headerJoin: " " })

    expect(result).toEqual({ headerJoin: " " })
  })

  it("should parse commentRows from comma-separated string", () => {
    const result = createDialectFromOptions({ commentRows: "0,5,10" })

    expect(result).toEqual({ commentRows: [0, 5, 10] })
  })

  it("should set commentChar", () => {
    const result = createDialectFromOptions({ commentChar: "#" })

    expect(result).toEqual({ commentChar: "#" })
  })

  it("should set quoteChar", () => {
    const result = createDialectFromOptions({ quoteChar: "'" })

    expect(result).toEqual({ quoteChar: "'" })
  })

  it("should set doubleQuote", () => {
    const result = createDialectFromOptions({ doubleQuote: true })

    expect(result).toEqual({ doubleQuote: true })
  })

  it("should set escapeChar", () => {
    const result = createDialectFromOptions({ escapeChar: "\\" })

    expect(result).toEqual({ escapeChar: "\\" })
  })

  it("should set nullSequence", () => {
    const result = createDialectFromOptions({ nullSequence: "NULL" })

    expect(result).toEqual({ nullSequence: "NULL" })
  })

  it("should set skipInitialSpace", () => {
    const result = createDialectFromOptions({ skipInitialSpace: true })

    expect(result).toEqual({ skipInitialSpace: true })
  })

  it("should set property", () => {
    const result = createDialectFromOptions({ property: "data" })

    expect(result).toEqual({ property: "data" })
  })

  it("should set itemType", () => {
    const result = createDialectFromOptions({ itemType: "object" })

    expect(result).toEqual({ itemType: "object" })
  })

  it("should parse itemKeys from comma-separated string", () => {
    const result = createDialectFromOptions({ itemKeys: "id,name,email" })

    expect(result).toEqual({ itemKeys: ["id", "name", "email"] })
  })

  it("should set sheetNumber", () => {
    const result = createDialectFromOptions({ sheetNumber: 1 })

    expect(result).toEqual({ sheetNumber: 1 })
  })

  it("should set sheetName", () => {
    const result = createDialectFromOptions({ sheetName: "Sheet1" })

    expect(result).toEqual({ sheetName: "Sheet1" })
  })

  it("should set table", () => {
    const result = createDialectFromOptions({ table: "users" })

    expect(result).toEqual({ table: "users" })
  })

  it("should handle complex CSV dialect", () => {
    const result = createDialectFromOptions({
      delimiter: ";",
      quoteChar: '"',
      doubleQuote: true,
      escapeChar: "\\",
      header: false,
      commentChar: "#",
    })

    expect(result).toEqual({
      delimiter: ";",
      quoteChar: '"',
      doubleQuote: true,
      escapeChar: "\\",
      header: false,
      commentChar: "#",
    })
  })

  it("should handle JSON dialect", () => {
    const result = createDialectFromOptions({
      property: "results",
      itemType: "object",
      itemKeys: "id,name,email",
    })

    expect(result).toEqual({
      property: "results",
      itemType: "object",
      itemKeys: ["id", "name", "email"],
    })
  })

  it("should handle spreadsheet dialect", () => {
    const result = createDialectFromOptions({
      sheetName: "Data",
      headerRows: "0,1",
      headerJoin: " ",
    })

    expect(result).toEqual({
      sheetName: "Data",
      headerRows: [0, 1],
      headerJoin: " ",
    })
  })

  it("should handle database dialect", () => {
    const result = createDialectFromOptions({
      table: "users",
    })

    expect(result).toEqual({
      table: "users",
    })
  })
})

describe("createToDialectFromOptions", () => {
  it("should return undefined when no options are provided", () => {
    const result = createToDialectFromOptions({})

    expect(result).toBeUndefined()
  })

  it("should create dialect with toDelimiter", () => {
    const result = createToDialectFromOptions({ toDelimiter: "," })

    expect(result).toEqual({ delimiter: "," })
  })

  it("should create dialect with multiple to-prefixed options", () => {
    const result = createToDialectFromOptions({
      toDelimiter: ",",
      toQuoteChar: '"',
      toEscapeChar: "\\",
    })

    expect(result).toEqual({
      delimiter: ",",
      quoteChar: '"',
      escapeChar: "\\",
    })
  })

  it("should set header to false when toHeader explicitly set", () => {
    const result = createToDialectFromOptions({ toHeader: false })

    expect(result).toEqual({ header: false })
  })

  it("should not set header when toHeader is true", () => {
    const result = createToDialectFromOptions({ toHeader: true })

    expect(result).toBeUndefined()
  })

  it("should parse toHeaderRows from comma-separated string", () => {
    const result = createToDialectFromOptions({ toHeaderRows: "0,1,2" })

    expect(result).toEqual({ headerRows: [0, 1, 2] })
  })

  it("should set toHeaderJoin", () => {
    const result = createToDialectFromOptions({ toHeaderJoin: " " })

    expect(result).toEqual({ headerJoin: " " })
  })

  it("should parse toCommentRows from comma-separated string", () => {
    const result = createToDialectFromOptions({ toCommentRows: "0,5,10" })

    expect(result).toEqual({ commentRows: [0, 5, 10] })
  })

  it("should set toCommentChar", () => {
    const result = createToDialectFromOptions({ toCommentChar: "#" })

    expect(result).toEqual({ commentChar: "#" })
  })

  it("should set toQuoteChar", () => {
    const result = createToDialectFromOptions({ toQuoteChar: "'" })

    expect(result).toEqual({ quoteChar: "'" })
  })

  it("should set toDoubleQuote", () => {
    const result = createToDialectFromOptions({ toDoubleQuote: true })

    expect(result).toEqual({ doubleQuote: true })
  })

  it("should set toEscapeChar", () => {
    const result = createToDialectFromOptions({ toEscapeChar: "\\" })

    expect(result).toEqual({ escapeChar: "\\" })
  })

  it("should set toNullSequence", () => {
    const result = createToDialectFromOptions({ toNullSequence: "NULL" })

    expect(result).toEqual({ nullSequence: "NULL" })
  })

  it("should set toSkipInitialSpace", () => {
    const result = createToDialectFromOptions({ toSkipInitialSpace: true })

    expect(result).toEqual({ skipInitialSpace: true })
  })

  it("should set toProperty", () => {
    const result = createToDialectFromOptions({ toProperty: "data" })

    expect(result).toEqual({ property: "data" })
  })

  it("should set toItemType", () => {
    const result = createToDialectFromOptions({ toItemType: "object" })

    expect(result).toEqual({ itemType: "object" })
  })

  it("should parse toItemKeys from comma-separated string", () => {
    const result = createToDialectFromOptions({ toItemKeys: "id,name,email" })

    expect(result).toEqual({ itemKeys: ["id", "name", "email"] })
  })

  it("should set toSheetNumber", () => {
    const result = createToDialectFromOptions({ toSheetNumber: 1 })

    expect(result).toEqual({ sheetNumber: 1 })
  })

  it("should set toSheetName", () => {
    const result = createToDialectFromOptions({ toSheetName: "Sheet1" })

    expect(result).toEqual({ sheetName: "Sheet1" })
  })

  it("should set toTable", () => {
    const result = createToDialectFromOptions({ toTable: "users" })

    expect(result).toEqual({ table: "users" })
  })

  it("should handle complex CSV to-dialect", () => {
    const result = createToDialectFromOptions({
      toDelimiter: ";",
      toQuoteChar: '"',
      toDoubleQuote: true,
      toEscapeChar: "\\",
      toHeader: false,
      toCommentChar: "#",
    })

    expect(result).toEqual({
      delimiter: ";",
      quoteChar: '"',
      doubleQuote: true,
      escapeChar: "\\",
      header: false,
      commentChar: "#",
    })
  })

  it("should handle JSON to-dialect", () => {
    const result = createToDialectFromOptions({
      toProperty: "results",
      toItemType: "object",
      toItemKeys: "id,name,email",
    })

    expect(result).toEqual({
      property: "results",
      itemType: "object",
      itemKeys: ["id", "name", "email"],
    })
  })

  it("should handle spreadsheet to-dialect", () => {
    const result = createToDialectFromOptions({
      toSheetName: "Data",
      toHeaderRows: "0,1",
      toHeaderJoin: " ",
    })

    expect(result).toEqual({
      sheetName: "Data",
      headerRows: [0, 1],
      headerJoin: " ",
    })
  })

  it("should handle database to-dialect", () => {
    const result = createToDialectFromOptions({
      toTable: "users",
    })

    expect(result).toEqual({
      table: "users",
    })
  })

  it("should not mix source and to options", () => {
    const result = createToDialectFromOptions({
      delimiter: ",",
      toDelimiter: ";",
    })

    expect(result).toEqual({ delimiter: ";" })
  })
})
