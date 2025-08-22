import { readFile } from "node:fs/promises"
import { writeFile } from "node:fs/promises"
import { read, utils, write } from "xlsx"

// We intentionally don't use dpkit's function here to isolate the tests

export async function readTestData(path: string) {
  const buffer = await readFile(path)
  const book = read(buffer, { type: "buffer" })
  const sheetName = book.SheetNames[0]
  const sheet = sheetName ? book.Sheets[sheetName] : undefined
  return sheet ? utils.sheet_to_json(sheet) : []
}

export async function writeTestData(
  path: string,
  rows: unknown[][],
  options?: { sheetNumber?: number; sheetName?: string },
) {
  const book = utils.book_new()
  const sheet = utils.aoa_to_sheet(rows)
  const sheetNumber = options?.sheetNumber ?? 1

  for (let i = 0; i < sheetNumber; i++) {
    const sheetName = options?.sheetName ?? `Sheet${i + 1}`
    utils.book_append_sheet(book, sheet, sheetName)
  }

  const buffer = write(book, { type: "buffer", bookType: "xlsx" })
  await writeFile(path, buffer)
}
