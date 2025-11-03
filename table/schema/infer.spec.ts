import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inferSchemaFromTable } from "./infer.ts"

describe("inferSchemaFromTable", () => {
  it("should infer from native types", async () => {
    const table = pl
      .DataFrame({
        integer: pl.Series("integer", [1, 2], pl.DataType.Int32),
        number: [1.1, 2.2],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "integer", type: "integer" },
        { name: "number", type: "number" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer integers from floats", async () => {
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        count: [10.0, 20.0, 30.0],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "count", type: "integer" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer numeric", async () => {
    const table = pl
      .DataFrame({
        name1: ["1", "2", "3"],
        name2: ["1,000", "2,000", "3,000"],
        name3: ["1.1", "2.2", "3.3"],
        name4: ["1,000.1", "2,000.2", "3,000.3"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer" },
        { name: "name2", type: "integer", groupChar: "," },
        { name: "name3", type: "number" },
        { name: "name4", type: "number", groupChar: "," },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer numeric (commaDecimal)", async () => {
    const table = pl
      .DataFrame({
        name1: ["1.000", "2.000", "3.000"],
        name2: ["1.000,5", "2.000,5", "3.000,5"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer", groupChar: "." },
        { name: "name2", type: "number", decimalChar: ",", groupChar: "." },
      ],
    }

    expect(await inferSchemaFromTable(table, { commaDecimal: true })).toEqual(
      schema,
    )
  })

  it("should infer booleans", async () => {
    const table = pl
      .DataFrame({
        name1: ["true", "True", "TRUE"],
        name2: ["false", "False", "FALSE"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "name1", type: "boolean" },
        { name: "name2", type: "boolean" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer objects", async () => {
    const table = pl
      .DataFrame({
        name1: ['{"a": 1}'],
        name2: ["{}"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "name1", type: "object" },
        { name: "name2", type: "object" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer arrays", async () => {
    const table = pl
      .DataFrame({
        name1: ["[1,2,3]"],
        name2: ["[]"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "name1", type: "array" },
        { name: "name2", type: "array" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer dates with ISO format", async () => {
    const table = pl
      .DataFrame({
        name1: ["2023-01-15", "2023-02-20", "2023-03-25"],
      })
      .lazy()

    const schema = {
      fields: [{ name: "name1", type: "date" }],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer dates with slash format", async () => {
    const table = pl
      .DataFrame({
        yearFirst: ["2023/01/15", "2023/02/20", "2023/03/25"],
        dayMonth: ["15/01/2023", "20/02/2023", "25/03/2023"],
        monthDay: ["01/15/2023", "02/20/2023", "03/25/2023"],
      })
      .lazy()

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

    expect(await inferSchemaFromTable(table)).toEqual(schemaDefault)
    expect(await inferSchemaFromTable(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })

  it("should infer dates with hyphen format", async () => {
    const table = pl
      .DataFrame({
        dayMonth: ["15-01-2023", "20-02-2023", "25-03-2023"],
      })
      .lazy()

    const schemaDefault = {
      fields: [{ name: "dayMonth", type: "date", format: "%d-%m-%Y" }],
    }

    const schemaMonthFirst = {
      fields: [{ name: "dayMonth", type: "date", format: "%m-%d-%Y" }],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schemaDefault)
    expect(await inferSchemaFromTable(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })

  it("should infer times with standard format", async () => {
    const table = pl
      .DataFrame({
        fullTime: ["14:30:45", "08:15:30", "23:59:59"],
        shortTime: ["14:30", "08:15", "23:59"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "fullTime", type: "time" },
        { name: "shortTime", type: "time", format: "%H:%M" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer times with 12-hour format", async () => {
    const table = pl
      .DataFrame({
        fullTime: ["2:30:45 PM", "8:15:30 AM", "11:59:59 PM"],
        shortTime: ["2:30 PM", "8:15 AM", "11:59 PM"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "fullTime", type: "time", format: "%I:%M:%S %p" },
        { name: "shortTime", type: "time", format: "%I:%M %p" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer times with timezone offset", async () => {
    const table = pl
      .DataFrame({
        name: ["14:30:45+01:00", "08:15:30-05:00", "23:59:59+00:00"],
      })
      .lazy()

    const schema = {
      fields: [{ name: "name", type: "time" }],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer datetimes with ISO format", async () => {
    const table = pl
      .DataFrame({
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
      })
      .lazy()

    const schema = {
      fields: [
        { name: "standard", type: "datetime" },
        { name: "utc", type: "datetime" },
        { name: "withTz", type: "datetime" },
        { name: "withSpace", type: "datetime", format: "%Y-%m-%d %H:%M:%S" },
      ],
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })

  it("should infer datetimes with custom formats", async () => {
    const table = pl
      .DataFrame({
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
      })
      .lazy()

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

    expect(await inferSchemaFromTable(table)).toEqual(schemaDefault)
    expect(await inferSchemaFromTable(table, { monthFirst: true })).toEqual(
      schemaMonthFirst,
    )
  })

  it("should infer lists", async () => {
    const table = pl
      .DataFrame({
        numericList: ["1.5,2.3", "4.1,5.9", "7.2,8.6"],
        integerList: ["1,2", "3,4", "5,6"],
        singleValue: ["1.5", "2.3", "4.1"],
      })
      .lazy()

    const schema = {
      fields: [
        { name: "numericList", type: "list", itemType: "number" },
        { name: "integerList", type: "list", itemType: "integer" },
        { name: "singleValue", type: "number" },
      ],
      missingValues: undefined,
    }

    expect(await inferSchemaFromTable(table)).toEqual(schema)
  })
})
