import type { Field } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { TableError } from "../error/index.js"
import type { Table } from "../table/index.js"
import type { PolarsField } from "./Field.js"
import { isCellMaxLenghtError } from "./checks/maxLength.js"
import { isCellMaximumError } from "./checks/maximum.js"
import { isCellMinLenghtError } from "./checks/minLength.js"
import { isCellMinimumError } from "./checks/minimum.js"
import { isCellPatternError } from "./checks/pattern.js"
import { isCellRequiredError } from "./checks/required.js"
import { isCellTypeError } from "./checks/type.js"
import { parseField } from "./parse.js"

export async function validateField(
  field: Field,
  options: {
    table: Table
    polarsField: PolarsField
    invalidRowsLimit?: number
  },
) {
  const { table, polarsField, invalidRowsLimit = 100 } = options
  const errors: TableError[] = []

  const nameErrors = validateFieldName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateFieldType(field, polarsField)
  errors.push(...typeErrors)

  if (!typeErrors.length) {
    const cellErros = await validateCells(
      field,
      table,
      polarsField,
      invalidRowsLimit,
    )
    errors.push(...cellErros)
  }

  return errors
}

function validateFieldName(field: Field, polarsField: PolarsField) {
  const errors: TableError[] = []

  if (field.name !== polarsField.name) {
    errors.push({
      type: "field/name",
      fieldName: field.name,
      actualFieldName: polarsField.name,
    })
  }

  return errors
}

function validateFieldType(field: Field, polarsField: PolarsField) {
  const errors: TableError[] = []

  const mapping: Record<string, Field["type"]> = {
    Bool: "boolean",
    Date: "date",
    Datetime: "datetime",
    Float32: "number",
    Float64: "number",
    Int16: "integer",
    Int32: "integer",
    Int64: "integer",
    Int8: "integer",
    List: "list",
    String: "string",
    Time: "time",
    UInt16: "integer",
    UInt32: "integer",
    UInt64: "integer",
    UInt8: "integer",
    Utf8: "string",
  }

  const actualFieldType = mapping[polarsField.type.variant]

  if (actualFieldType !== field.type && actualFieldType !== "string") {
    errors.push({
      type: "field/type",
      fieldName: field.name,
      fieldType: field.type,
      actualFieldType,
    })
  }

  return errors
}

async function validateCells(
  field: Field,
  table: Table,
  polarsField: PolarsField,
  invalidRowsLimit: number,
) {
  const source = col("source")
  const target = col("target")
  const errors: TableError[] = []

  // String with nothing to validate
  if (field.type === "string") {
    if (!field.format && !field.constraints) {
      return errors
    }
  }

  const errorsTable = await table
    .withRowCount()
    .select([
      col("row_nr").add(1).alias("number"),
      col(polarsField.name).alias("source"),
      polarsField.type.equals(DataType.String)
        ? parseField(field, { expr: col(polarsField.name) }).alias("target")
        : col(polarsField.name).alias("target"),
    ])
    .select([
      col("number"),
      col("source"),
      isCellTypeError(source, target).alias("cell/type"),
      isCellRequiredError(field, target).alias("cell/required"),
      isCellMinimumError(field, target).alias("cell/minimum"),
      isCellMaximumError(field, target).alias("cell/maximum"),
      isCellMinimumError(field, target, true).alias("cell/exclusiveMinimum"),
      isCellMaximumError(field, target, true).alias("cell/exclusiveMaximum"),
      isCellMinLenghtError(field, target).alias("cell/minLength"),
      isCellMaxLenghtError(field, target).alias("cell/maxLength"),
      isCellPatternError(field, target).alias("cell/pattern"),
    ])
    .filter(
      col("cell/type")
        .eq(true)
        .or(col("cell/required").eq(true))
        .or(col("cell/minimum").eq(true))
        .or(col("cell/maximum").eq(true))
        .or(col("cell/exclusiveMinimum").eq(true))
        .or(col("cell/exclusiveMaximum").eq(true))
        .or(col("cell/minLength").eq(true))
        .or(col("cell/maxLength").eq(true))
        .or(col("cell/pattern").eq(true)),
    )
    .head(invalidRowsLimit)
    .collect()

  for (const record of errorsTable.toRecords() as any[]) {
    for (const type of [
      "cell/type",
      "cell/required",
      "cell/minimum",
      "cell/maximum",
      "cell/exclusiveMinimum",
      "cell/exclusiveMaximum",
      "cell/minLength",
      "cell/maxLength",
      "cell/pattern",
    ] as const) {
      if (record[type] === true) {
        errors.push({
          type,
          fieldName: field.name,
          rowNumber: record.number,
          cell: record.source ?? "",
        })
      }
    }
  }

  return errors
}
