import type { Dialect } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import type { Table } from "../table/index.ts"

export async function joinHeaderRows(
  table: Table,
  options: { dialect: Dialect },
) {
  const { dialect } = options

  const headerOffset = getHeaderOffset(dialect)
  const headerRows = getHeaderRows(dialect)
  const headerJoin = dialect?.headerJoin ?? " "
  if (headerRows.length < 2) {
    return table
  }

  const extraLabelsFrame = await table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(headerOffset).isIn(headerRows))
    .select(...table.columns.map(name => pl.col(name).str.concat(headerJoin)))
    .collect()

  const labels = table.columns
  const extraLabels = extraLabelsFrame.row(0)

  const mapping = Object.fromEntries(
    labels.map((label, index) => [
      label,
      [label, extraLabels[index]].join(headerJoin),
    ]),
  )

  return table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(headerOffset).isIn(headerRows).not())
    .rename(mapping)
    .drop("row_nr")
}

export function skipCommentRows(table: Table, options: { dialect: Dialect }) {
  const { dialect } = options

  const commentOffset = getCommentOffset(dialect)
  if (!dialect?.commentRows) {
    return table
  }

  return table
    .withRowCount()
    .withColumn(pl.col("row_nr").add(1))
    .filter(pl.col("row_nr").add(commentOffset).isIn(dialect.commentRows).not())
    .drop("row_nr")
}

export function stripInitialSpace(table: Table, options: { dialect: Dialect }) {
  const { dialect } = options

  if (!dialect?.skipInitialSpace) {
    return table
  }

  return table.select(
    // TODO: rebase on stripCharsStart when it's fixed in polars
    // https://github.com/pola-rs/nodejs-polars/issues/336
    table.columns.map(name => pl.col(name).str.strip().as(name)),
  )
}

function getHeaderOffset(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows.at(0) ?? 0
}

function getHeaderRows(dialect?: Dialect) {
  return dialect?.header !== false ? (dialect?.headerRows ?? [1]) : []
}

function getCommentOffset(dialect?: Dialect) {
  const headerRows = getHeaderRows(dialect)
  return headerRows.at(-1) ?? 0
}
