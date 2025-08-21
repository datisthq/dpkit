import type { Dialect } from "@dpkit/core"

export type DataRow = unknown[]
export type DataRecord = Record<string, unknown>

export function getRecordsFromRows(rows: DataRow[], dialect?: Dialect) {
  const records: DataRecord[] = []

  const header = getHeaderFromRows(rows, dialect)
  const content = getContentFromRows(rows, dialect)

  const labels = getLabelsFromHeader(header, dialect)
  if (!labels) {
    return records
  }

  for (const row of content) {
    const isCommentedRow = getIsCommentedRow(row, dialect)
    if (isCommentedRow) {
      continue
    }

    records.push(
      Object.fromEntries(labels.map((label, index) => [label, row[index]])),
    )
  }

  return records
}

function getHeaderFromRows(rows: DataRow[], dialect?: Dialect) {
  const hasHeader = dialect?.header !== false
  const headerRows = dialect?.headerRows ?? [1]

  if (!hasHeader) {
    const length = Math.max(...rows.map(row => row.length))
    const labels = Array.from({ length }, (_, idx) => `column_${idx + 1}`)

    return [labels]
  }

  const header: DataRow[] = []
  for (const number of headerRows) {
    const row = rows[number - 1]
    if (row) {
      header.push(row)
    }
  }

  return header
}

function getContentFromRows(rows: DataRow[], dialect?: Dialect) {
  const hasHeader = dialect?.header !== false
  const headerRows = dialect?.headerRows ?? (hasHeader ? [1] : [])
  const commentRows = dialect?.commentRows ?? []
  const skipRows = headerRows[0] ? headerRows[0] - 1 : 0

  const content: DataRow[] = []
  for (const [index, row] of rows.entries()) {
    const number = index + 1

    if (number <= skipRows) {
      continue
    }

    if (headerRows.includes(number)) {
      continue
    }

    if (commentRows.includes(number)) {
      continue
    }

    const isCommentedRow = getIsCommentedRow(row, dialect)
    if (isCommentedRow) {
      continue
    }

    content.push(row)
  }

  return content
}

function getLabelsFromHeader(header: DataRow[], dialect?: Dialect) {
  if (!header[0]) {
    return undefined
  }

  const labels = header[0].map(String)
  const headerJoin = dialect?.headerJoin ?? " "

  for (const row of header.slice(1)) {
    for (const [index, label] of row.entries()) {
      const prefix = labels[index] ?? ""
      labels[index] = [prefix, label].filter(Boolean).join(headerJoin)
    }
  }

  return labels
}

function getIsCommentedRow(row: unknown[], dialect?: Dialect) {
  const commentChar = dialect?.commentChar

  if (!commentChar) {
    return false
  }

  if (typeof row[0] !== "string") {
    return false
  }

  return row[0].startsWith(commentChar)
}
