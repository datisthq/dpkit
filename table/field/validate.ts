import type { Field } from "@dpkit/core"
import type { CellError, FieldError, TableError } from "@dpkit/core"
import { createReport } from "@dpkit/core"
import * as pl from "nodejs-polars"
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
import { validateArrayField } from "./types/array.ts"
import { validateGeojsonField } from "./types/geojson.ts"
import { validateObjectField } from "./types/object.ts"

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

  return createReport(errors)
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
  const variant = mapping.source.type.variant

  // TODO: Rebase on proper polars type definition when available
  // https://github.com/pola-rs/nodejs-polars/issues/372
  const compatMapping: Record<string, Field["type"][]> = {
    Bool: ["boolean"],
    Categorical: ["string"],
    Date: ["date"],
    Datetime: ["datetime"],
    Float32: ["number", "integer"],
    Float64: ["number", "integer"],
    Int16: ["integer"],
    Int32: ["integer"],
    Int64: ["integer"],
    Int8: ["integer"],
    List: ["list"],
    String: ["any"],
    Time: ["time"],
    UInt16: ["integer"],
    UInt32: ["integer"],
    UInt64: ["integer"],
    UInt8: ["integer"],
    Utf8: ["any"],
  }

  const compatTypes = compatMapping[variant] ?? []
  const isCompat = !!new Set(compatTypes).intersection(
    new Set([mapping.target.type, "any"]),
  ).size

  if (!isCompat) {
    errors.push({
      type: "field/type",
      fieldName: mapping.target.name,
      fieldType: mapping.target.type ?? "any",
      actualFieldType: compatTypes[0] ?? "any",
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

  // Types that require non-polars validation
  switch (mapping.target.type) {
    case "array":
      return await validateArrayField(mapping.target, table)
    case "geojson":
      return await validateGeojsonField(mapping.target, table)
    case "object":
      return await validateObjectField(mapping.target, table)
  }

  let fieldCheckTable = table
    .withRowCount()
    .select(
      pl.col("row_nr").add(1).alias("number"),
      normalizeField(mapping).alias("target"),
      normalizeField(mapping, { keepType: true }).alias("source"),
      pl.lit(null).alias("error"),
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
    const cellMapping = { source: pl.col("source"), target: pl.col("target") }

    const check = checkCell(mapping.target, cellMapping)
    if (!check) continue

    fieldCheckTable = fieldCheckTable.withColumn(
      pl
        .when(pl.col("error").isNotNull())
        .then(pl.col("error"))
        .when(check.isErrorExpr)
        .then(pl.lit(JSON.stringify(check.errorTemplate)))
        .otherwise(pl.lit(null))
        .alias("error"),
    )
  }

  const fieldCheckFrame = await fieldCheckTable
    .filter(pl.col("error").isNotNull())
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
