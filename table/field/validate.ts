import type { Field } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { TableError } from "../error/index.js"
import type { Table } from "../table/index.js"
import type { PolarsField } from "./Field.js"
import { parseField } from "./parse.js"

export async function validateField(
  field: Field,
  options: {
    table: Table
    polarsField: PolarsField
  },
) {
  const { table, polarsField } = options
  const errors: TableError[] = []

  const nameErrors = validateFieldName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateFieldType(field, polarsField)
  errors.push(...typeErrors)

  if (polarsField.type.equals(DataType.String)) {
    const typeErros = await validateCellTypes(field, table)
    errors.push(...typeErros)
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

async function validateCellTypes(field: Field, table: Table) {
  const errors: TableError[] = []

  const failures = await table
    .withRowCount()
    .select([
      col("row_nr").add(1).alias("number"),
      col(field.name).alias("source"),
      parseField(field, { expr: col(field.name) }).alias("target"),
    ])
    .filter(col("source").isNotNull())
    .filter(col("target").isNull())
    .head(100)
    .collect()

  for (const failure of failures.toRecords() as any[]) {
    errors.push({
      type: "cell/type",
      cell: failure.source,
      fieldName: field.name,
      rowNumber: failure.number,
    })
  }

  return errors
}
