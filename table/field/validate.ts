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

  if (polarsField.type.equals(DataType.String)) {
    const typeErros = await validateCellTypes(field, { table })
    errors.push(...typeErros)
  }

  return errors
}

async function validateCellTypes(
  field: Field,
  options: {
    table: Table
  },
) {
  const { table } = options
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
