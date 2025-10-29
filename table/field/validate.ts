import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { CellError, FieldError, TableError } from "../error/index.ts"
import type { Table } from "../table/index.ts"
import type { FieldMapping } from "./Mapping.ts"
import { checkCellEnum } from "./checks/enum.ts"
import { checkCellMaxLength } from "./checks/maxLength.ts"
import { createCheckCellMaximum } from "./checks/maximum.ts"
import { checkCellMinLength } from "./checks/minLength.ts"
import { createCheckCellMinimum } from "./checks/minimum.ts"
import { checkCellPattern } from "./checks/pattern.ts"
import { checkCellRequired } from "./checks/required.ts"
import { checkCellType } from "./checks/type.ts"
import { checkCellUnique } from "./checks/unique.ts"
import { normalizeField } from "./normalize.ts"

export async function validateField(
  mapping: FieldMapping,
  table: Table,
  options: {
    maxErrors: number
  },
) {
  const { maxErrors } = options
  const errors: TableError[] = []

  const nameErrors = validateName(mapping)
  errors.push(...nameErrors)

  const typeErrors = validateType(mapping)
  errors.push(...typeErrors)

  if (!typeErrors.length) {
    const dataErorrs = await validateCells(mapping, table, { maxErrors })
    errors.push(...dataErorrs)
  }

  return { errors, valid: !errors.length }
}

function validateName(mapping: FieldMapping) {
  const errors: FieldError[] = []

  if (mapping.source.name !== mapping.target.name) {
    errors.push({
      type: "field/name",
      fieldName: mapping.target.name,
      actualFieldName: mapping.source.name,
    })
  }

  return errors
}

function validateType(mapping: FieldMapping) {
  const errors: FieldError[] = []

  const types: Record<string, Field["type"]> = {
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

  const actualFieldType = types[mapping.source.type.variant] ?? "any"

  if (actualFieldType !== mapping.target.type && actualFieldType !== "string") {
    errors.push({
      type: "field/type",
      fieldName: mapping.target.name,
      fieldType: mapping.target.type ?? "any",
      actualFieldType,
    })
  }

  return errors
}

async function validateCells(
  mapping: FieldMapping,
  table: Table,
  options: {
    maxErrors: number
  },
) {
  const { maxErrors } = options
  const errors: CellError[] = []

  let fieldCheckTable = table
    .withRowCount()
    .select(
      col("row_nr").add(1).alias("number"),
      normalizeField(mapping).alias("target"),
      normalizeField(mapping, { keepType: true }).alias("source"),
      lit(null).alias("error"),
    )

  for (const checkCell of [
    checkCellType,
    checkCellRequired,
    checkCellPattern,
    checkCellEnum,
    createCheckCellMinimum(),
    createCheckCellMaximum(),
    createCheckCellMinimum({ isExclusive: true }),
    createCheckCellMaximum({ isExclusive: true }),
    checkCellMinLength,
    checkCellMaxLength,
    checkCellUnique,
  ]) {
    const cellMapping = { source: col("source"), target: col("target") }
    const check = checkCell(mapping.target, cellMapping)

    if (check) {
      fieldCheckTable = fieldCheckTable.withColumn(
        when(col("error").isNotNull())
          .then(col("error"))
          .when(check.isErrorExpr)
          .then(lit(JSON.stringify(check.errorTemplate)))
          .otherwise(lit(null))
          .alias("error"),
      )
    }
  }

  const fieldCheckFrame = await fieldCheckTable
    .filter(col("error").isNotNull())
    .drop(["target"])
    .head(maxErrors)
    .collect()

  for (const row of fieldCheckFrame.toRecords() as any[]) {
    const errorTemplate = JSON.parse(row.error) as CellError
    errors.push({
      ...errorTemplate,
      rowNumber: row.number,
      cell: String(row.source ?? ""),
    })
  }

  return errors
}
