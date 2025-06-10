import { DataFrame, Series } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inferSchema } from "./infer.js"

describe("inferSchema", () => {
  it("should infer from native types", async () => {
    const table = DataFrame({
      integer: Series("integer", [1, 2], DataType.Int32),
      number: [1.1, 2.2],
    }).lazy()

    const schema = {
      fields: [
        { name: "integer", type: "integer" },
        { name: "number", type: "number" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer numeric", async () => {
    const table = DataFrame({
      name1: ["1", "2", "3"],
      name2: ["1,1", "2,2", "3,3"],
      name3: ["1.1", "2.2", "3.3"],
      name4: ["1,000.1", "2,000.2", "3,000.3"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer" },
        { name: "name2", type: "integer", groupChar: "," },
        { name: "name3", type: "number" },
        { name: "name4", type: "number", groupChar: "," },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer numeric (commaDecimal)", async () => {
    const table = DataFrame({
      name1: ["1.1", "2.2", "3.3"],
      name2: ["1.1,0", "2.2,0", "3.3,0"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer", groupChar: "." },
        { name: "name2", type: "number", decimalChar: ",", groupChar: "." },
      ],
    }

    expect(await inferSchema(table, { commaDecimal: true })).toEqual(schema)
  })

  it("should infer booleans", async () => {
    const table = DataFrame({
      name1: ["true", "True", "TRUE"],
      name2: ["false", "False", "FALSE"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "boolean" },
        { name: "name2", type: "boolean" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer objects", async () => {
    const table = DataFrame({
      name1: ['{"a": 1}'],
      name2: ["{}"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "object" },
        { name: "name2", type: "object" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer arrays", async () => {
    const table = DataFrame({
      name1: ["[1,2,3]"],
      name2: ["[]"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "array" },
        { name: "name2", type: "array" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer dates with ISO format", async () => {
    const table = DataFrame({
      name1: ["2023-01-15", "2023-02-20", "2023-03-25"],
    }).lazy()

    const schema = {
      fields: [{ name: "name1", type: "date" }],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer dates with slash format", async () => {
    const table = DataFrame({
      yearFirst: ["2023/01/15", "2023/02/20", "2023/03/25"],
      dayMonth: ["15/01/2023", "20/02/2023", "25/03/2023"],
      monthDay: ["01/15/2023", "02/20/2023", "03/25/2023"],
    }).lazy()

    const schemaDefault = {
      fields: [
        { name: "yearFirst", type: "date", format: "%Y/%m/%d" },
        { name: "dayMonth", type: "date", format: "%d/%m/%Y" },
        { name: "monthDay", type: "date", format: "%d/%m/%Y" },
      ],
    }

    const schemaMonthFirst = {
      fields: [
        { name: "yearFirst", type: "date", format: "%Y/%m/%d" },
        { name: "dayMonth", type: "date", format: "%m/%d/%Y" },
        { name: "monthDay", type: "date", format: "%m/%d/%Y" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schemaDefault)
    expect(await inferSchema(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })

  it("should infer dates with hyphen format", async () => {
    const table = DataFrame({
      dayMonth: ["15-01-2023", "20-02-2023", "25-03-2023"],
    }).lazy()

    const schemaDefault = {
      fields: [{ name: "dayMonth", type: "date", format: "%d-%m-%Y" }],
    }

    const schemaMonthFirst = {
      fields: [{ name: "dayMonth", type: "date", format: "%m-%d-%Y" }],
    }

    expect(await inferSchema(table)).toEqual(schemaDefault)
    expect(await inferSchema(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })

  it("should infer times with standard format", async () => {
    const table = DataFrame({
      fullTime: ["14:30:45", "08:15:30", "23:59:59"],
      shortTime: ["14:30", "08:15", "23:59"],
    }).lazy()

    const schema = {
      fields: [
        { name: "fullTime", type: "time" },
        { name: "shortTime", type: "time", format: "%H:%M" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer times with 12-hour format", async () => {
    const table = DataFrame({
      fullTime: ["2:30:45 PM", "8:15:30 AM", "11:59:59 PM"],
      shortTime: ["2:30 PM", "8:15 AM", "11:59 PM"],
    }).lazy()

    const schema = {
      fields: [
        { name: "fullTime", type: "time", format: "%I:%M:%S %p" },
        { name: "shortTime", type: "time", format: "%I:%M %p" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer times with timezone offset", async () => {
    const table = DataFrame({
      name: ["14:30:45+01:00", "08:15:30-05:00", "23:59:59+00:00"],
    }).lazy()

    const schema = {
      fields: [{ name: "name", type: "time" }],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer datetimes with ISO format", async () => {
    const table = DataFrame({
      standard: [
        "2023-01-15T14:30:45",
        "2023-02-20T08:15:30",
        "2023-03-25T23:59:59",
      ],
      utc: [
        "2023-01-15T14:30:45Z",
        "2023-02-20T08:15:30Z",
        "2023-03-25T23:59:59Z",
      ],
      withTz: [
        "2023-01-15T14:30:45+01:00",
        "2023-02-20T08:15:30-05:00",
        "2023-03-25T23:59:59+00:00",
      ],
      withSpace: [
        "2023-01-15 14:30:45",
        "2023-02-20 08:15:30",
        "2023-03-25 23:59:59",
      ],
    }).lazy()

    const schema = {
      fields: [
        { name: "standard", type: "datetime" },
        { name: "utc", type: "datetime" },
        { name: "withTz", type: "datetime" },
        { name: "withSpace", type: "datetime", format: "%Y-%m-%d %H:%M:%S" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schema)
  })

  it("should infer datetimes with custom formats", async () => {
    const table = DataFrame({
      shortDayMonth: [
        "15/01/2023 14:30",
        "20/02/2023 08:15",
        "25/03/2023 23:59",
      ],
      fullDayMonth: [
        "15/01/2023 14:30:45",
        "20/02/2023 08:15:30",
        "25/03/2023 23:59:59",
      ],
      shortMonthDay: [
        "01/15/2023 14:30",
        "02/20/2023 08:15",
        "03/25/2023 23:59",
      ],
      fullMonthDay: [
        "01/15/2023 14:30:45",
        "02/20/2023 08:15:30",
        "03/25/2023 23:59:59",
      ],
    }).lazy()

    const schemaDefault = {
      fields: [
        { name: "shortDayMonth", type: "datetime", format: "%d/%m/%Y %H:%M" },
        { name: "fullDayMonth", type: "datetime", format: "%d/%m/%Y %H:%M:%S" },
        { name: "shortMonthDay", type: "datetime", format: "%d/%m/%Y %H:%M" },
        { name: "fullMonthDay", type: "datetime", format: "%d/%m/%Y %H:%M:%S" },
      ],
    }

    const schemaMonthFirst = {
      fields: [
        { name: "shortDayMonth", type: "datetime", format: "%m/%d/%Y %H:%M" },
        { name: "fullDayMonth", type: "datetime", format: "%m/%d/%Y %H:%M:%S" },
        { name: "shortMonthDay", type: "datetime", format: "%m/%d/%Y %H:%M" },
        { name: "fullMonthDay", type: "datetime", format: "%m/%d/%Y %H:%M:%S" },
      ],
    }

    expect(await inferSchema(table)).toEqual(schemaDefault)
    expect(await inferSchema(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })
})
