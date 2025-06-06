import type { Field } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { TableError } from "../error/index.js"
import type { PolarsField } from "../field/index.js"
import type { Table } from "../table/index.js"
import { parseColumn } from "./parse.js"

export async function validateColumn(props: {
  table: Table
  field: Field
  polarsField: PolarsField
}) {
  const { table, field, polarsField } = props
  const errors: TableError[] = []

  if (polarsField.type.equals(DataType.String)) {
    const typeErros = await validateCellTypes({ table, field })
    errors.push(...typeErros)
  }

  return errors
}

async function validateCellTypes(props: {
  table: Table
  field: Field
}) {
  const { table, field } = props
  const errors: TableError[] = []

  const failures = await table
    .withRowCount()
    .select([
      col("row_nr").add(1).alias("number"),
      col(field.name).alias("source"),
      parseColumn({ field, expr: col(field.name) }).alias("target"),
    ])
    .filter(col("source").isNotNull())
    .filter(col("target").isNull())
    .head(100)
    .collect()

  for (const failure of failures.toRecords() as any[]) {
    errors.push({
      type: "type",
      cell: failure.source,
      fieldName: field.name,
      rowNumber: failure.number,
    })
  }

  return errors
}
