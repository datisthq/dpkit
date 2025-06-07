import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseBooleanField } from "./boolean.js"

describe("parseBooleanField", () => {
  it.each([
    // Default true values
    ["true", true, {}],
    ["True", true, {}],
    ["TRUE", true, {}],
    ["1", true, {}],

    // Default false values
    ["false", false, {}],
    ["False", false, {}],
    ["FALSE", false, {}],
    ["0", false, {}],

    // Invalid values
    ["", null, {}],
    ["invalid", null, {}],
    ["truthy", null, {}],
    ["falsy", null, {}],
    ["2", null, {}],
    ["-100", null, {}],
    ["t", null, {}],
    ["f", null, {}],
    ["3.14", null, {}],

    // Custom true values
    ["Y", true, { trueValues: ["Y", "y", "yes"] }],
    ["y", true, { trueValues: ["Y", "y", "yes"] }],
    ["yes", true, { trueValues: ["Y", "y", "yes"] }],
    ["true", null, { trueValues: ["Y", "y", "yes"] }],

    // Custom false values
    ["N", false, { falseValues: ["N", "n", "no"] }],
    ["n", false, { falseValues: ["N", "n", "no"] }],
    ["no", false, { falseValues: ["N", "n", "no"] }],
    ["false", null, { falseValues: ["N", "n", "no"] }],

    // Custom true and false values
    ["oui", true, { trueValues: ["oui", "si"], falseValues: ["non", "no"] }],
    ["si", true, { trueValues: ["oui", "si"], falseValues: ["non", "no"] }],
    ["non", false, { trueValues: ["oui", "si"], falseValues: ["non", "no"] }],
    ["no", false, { trueValues: ["oui", "si"], falseValues: ["non", "no"] }],
  ])("%s -> %s %o", (cell, value, options) => {
    const field = { name: "name", type: "boolean" as const, ...options }
    const df = DataFrame({ name: [cell] }).select(parseBooleanField(field))
    expect(df.toRecords()[0]?.name).toEqual(value)
  })
})
